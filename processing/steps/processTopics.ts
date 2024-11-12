import { $ } from 'bun'
import { join } from 'path'
import { TOPIC_DIR } from '../directories.const'
import { type Topic } from '../topics.const'
import {
  backupTable,
  diffTables,
  dropDiffTable,
  getSchemaTables,
  getTopicTables,
} from '../utils/diffing'
import { directoryHasChanged, updateDirectoryHash } from '../utils/hashing'
import { logEnd, logStart } from '../utils/logging'
import { params } from '../utils/parameters'
import { endTimer, startTimer } from '../utils/timeTracking'
import { filteredFilePath } from './filter'

const topicPath = (topic: Topic | 'helper') => join(TOPIC_DIR, topic)
const mainFilePath = (topic: Topic) => join(topicPath(topic), topic)

async function runSQL(topic: Topic) {
  const psqlFile = `${mainFilePath(topic)}.sql`

  if (await Bun.file(psqlFile).exists()) {
    return $`psql -q -f ${psqlFile}`
  }
}

async function runLua(fileName: string, topic: Topic) {
  const filePath = filteredFilePath(fileName)
  const luaFile = `${mainFilePath(topic)}.lua`

  return $`osm2pgsql \
            --number-processes=8 \
            --create \
            --output=flex \
            --extra-attributes \
            --style=${luaFile} \
            ${filePath}`
}

export async function runTopic(fileName: string, topic: Topic) {
  await runLua(fileName, topic)
  await runSQL(topic)
}

export async function processTopics(
  topics: readonly Topic[],
  fileName: string,
  fileChanged: boolean,
) {
  const processedTables = await getSchemaTables('public')
  const backedUpTables = await getSchemaTables('backup')

  // drop all previous diffs
  if (!params.freezeData) {
    processedTables.forEach(dropDiffTable)
  }

  // when the helpers have changed we disable all diffing functionality
  const helpersChanged = await directoryHasChanged(topicPath('helper'))
  updateDirectoryHash(topicPath('helper'))
  if (helpersChanged) {
    console.log('Helpers have changed. Rerunning all code.')
  }

  const skipCode = params.skipUnchanged && !helpersChanged && !fileChanged
  const diffChanges = params.computeDiffs && !fileChanged

  startTimer('processing')
  for (const topic of topics) {
    const topicChanged = await directoryHasChanged(topicPath(topic))
    if (skipCode && !topicChanged) {
      console.log(`Topic "${topic}" hasn't change. Skipping execution with SKIP_UNCHANGED=1!`)
    } else {
      logStart(topic)

      // get all tables related to `topic` that are already present in our db
      const topicTables = await getTopicTables(topic)
      const processdTopicTables = topicTables.intersection(processedTables)

      // backup all tables related to topic
      if (diffChanges) {
        if (params.freezeData) {
          // with FREEZE_DATA=1 we only backup tables that are not already backed up
          const toBackup = processdTopicTables.difference(backedUpTables)
          await Promise.all(Array.from(toBackup).map(backupTable))
        } else {
          await Promise.all(Array.from(processdTopicTables).map(backupTable))
        }
      }

      // run the topic with osm2pgsql and the sql post-processing
      await runTopic(fileName, topic)

      // update the code hashes
      updateDirectoryHash(topicPath(topic))

      if (diffChanges) {
        diffTables(Array.from(processdTopicTables))
      }

      logEnd(topic)
    }
  }

  const timeElapsed = endTimer('processing')
  return timeElapsed
}
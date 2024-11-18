import { $ } from 'bun'
import { join } from 'path'
import { TOPIC_DIR } from '../constants/directories.const'
import { type Topic } from '../constants/topics.const'
import {
  backupTable,
  diffTables,
  dropDiffTable,
  getSchemaTables,
  getTopicTables,
} from '../utils/diffing'
import { directoryHasChanged, updateDirectoryHash } from '../utils/hashing'
import { logEnd, logStart } from '../utils/logging'
import { filteredFilePath } from './filter'

const topicPath = (topic: Topic | 'helper') => join(TOPIC_DIR, topic)
const mainFilePath = (topic: Topic) => join(topicPath(topic), topic)

/**
 * Run the given topic's SQL file
 * @param topic
 * @returns
 */
async function runSQL(topic: Topic) {
  const psqlFile = `${mainFilePath(topic)}.sql`

  if (await Bun.file(psqlFile).exists()) {
    try {
      await $`psql -q -f ${psqlFile}`
    } catch {
      throw new Error(`Failed to run SQL file ${psqlFile}`)
    }
  }
}

/**
 * Run the given topic's lua file with osm2pgsql on the given file
 * @param fileName
 * @param topic
 * @returns
 */
async function runLua(fileName: string, topic: Topic) {
  const filePath = filteredFilePath(fileName)
  const luaFile = `${mainFilePath(topic)}.lua`
  try {
    await $`osm2pgsql \
              --number-processes=8 \
              --create \
              --output=flex \
              --extra-attributes \
              --style=${luaFile} \
              ${filePath}`
  } catch {
    throw new Error(`Failed to run lua file ${luaFile}`)
  }
}

/**
 * Run the given topic with osm2pgsql and the sql post-processing
 * @param fileName
 * @param topic
 */
export async function runTopic(fileName: string, topic: Topic) {
  await runLua(fileName, topic)
  await runSQL(topic)
}

/**
 * Run the given topics with optional diffing and code caching
 * @param topics a list of topics to run
 * @param fileName an OSM file name to run the topics on
 * @param fileChanged whether the file has changed since the last run
 * @param skipUnchanged whether to skip topics that haven't changed
 * @param computeDiffs whether to compute diffs
 * @param freezeData whether to freeze the data
 * @returns
 */
export async function processTopics(
  topics: readonly Topic[],
  fileName: string,
  fileChanged: boolean,
  skipUnchanged: boolean,
  computeDiffs: boolean,
  freezeData: boolean,
) {
  const tableListPublic = await getSchemaTables('public')
  const tableListBackup = await getSchemaTables('backup')
  const processedTables = new Set<string>()

  // drop all previous diffs
  if (!freezeData) {
    tableListPublic.forEach(dropDiffTable)
  }

  // when the helpers have changed we disable all diffing functionality
  const helpersChanged = await directoryHasChanged(topicPath('helper'))
  updateDirectoryHash(topicPath('helper'))
  if (helpersChanged) {
    console.log('Helpers have changed. Rerunning all code.')
  }

  const skipCode = skipUnchanged && !helpersChanged && !fileChanged
  const diffChanges = computeDiffs && !fileChanged

  logStart('Processing')
  for (const topic of topics) {
    // get all tables related to `topic`
    const topicTables = await getTopicTables(topic)
    topicTables.forEach((table) => processedTables.add(table))

    const topicChanged = await directoryHasChanged(topicPath(topic))
    if (skipCode && !topicChanged) {
      console.log(
        `⏩ Skipping topic "${topic}". The code hasn't changed and SKIP_UNCHANGED is active.`,
      )
    } else {
      logStart(`Processing ${topic}`)

      const processedTopicTables = topicTables.intersection(tableListPublic)

      // backup all tables related to topic
      if (diffChanges) {
        if (freezeData) {
          // with FREEZE_DATA=1 we only backup tables that are not already backed up
          const toBackup = processedTopicTables.difference(tableListBackup)
          await Promise.all(Array.from(toBackup).map(backupTable))
        } else {
          await Promise.all(Array.from(processedTopicTables).map(backupTable))
        }
      }

      // run the topic with osm2pgsql and the sql post-processing
      await runTopic(fileName, topic)

      // update the code hashes
      updateDirectoryHash(topicPath(topic))

      if (diffChanges) {
        await diffTables(Array.from(processedTopicTables))
      }

      logEnd(`Processing ${topic}`)
    }
  }

  const timeElapsed = logEnd('Processing')
  return { timeElapsed, processedTables: Array.from(processedTables) }
}

import { $ } from 'bun'
import { join } from 'path'
import { TOPIC_DIR } from './directories.const'
import { filteredFile } from './filter'
import { type Topic } from './topics.const'
import {
  backupTable,
  computeDiff,
  dropDiffTable,
  getSchemaTables,
  getTopicTables,
} from './utils/diffing'
import { directoryHasChanged, updateDirectoryHash } from './utils/hashing'
import { logEnd, logStart } from './utils/logging'
import { params } from './utils/parameters'

const topicPath = (topic: Topic | 'helper') => join(TOPIC_DIR, topic)
const mainFilePath = (topic: Topic) => join(topicPath(topic), topic)

async function runSQL(topic: Topic) {
  const psqlFile = `${mainFilePath(topic)}.sql`

  if (await Bun.file(psqlFile).exists()) {
    const logId = `Run SQL ${topic}`
    console.time(logId)
    return $`psql -q -f ${psqlFile}`.then(() => console.timeEnd(logId))
  }
}

async function runLua(fileName: string, topic: Topic) {
  const filePath = filteredFile(fileName)
  const logId = `Run LUA ${topic}`
  const luaFile = `${mainFilePath(topic)}.lua`

  console.time(logId)
  return $`osm2pgsql \
            --number-processes=8 \
            --create \
            --output=flex \
            --extra-attributes \
            --style=${luaFile} \
            ${filePath}`.then(() => console.timeEnd(logId))
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
  const diffingPossible = !helpersChanged && !fileChanged
  updateDirectoryHash(topicPath('helper'))

  for (const topic of topics) {
    if (params.skipUnchanged && (await directoryHasChanged(topicPath(topic)))) {
      logStart(topic)

      // get all tables related to `topic` and are already present in our db
      const topicTables = (await getTopicTables(topic)).filter((table) =>
        processedTables.has(table),
      )

      if (diffingPossible && params.computeDiffs) {
        await Promise.all(
          topicTables
            .filter((table) => !params.freezeData || !backedUpTables.has(table))
            .map(async (table) => {
              backedUpTables.add(table)
              return backupTable(table)
            }),
        )
      }

      await runTopic(fileName, topic)

      updateDirectoryHash(topicPath(topic))

      if (diffingPossible && params.computeDiffs) {
        for (const table of topicTables) {
          const { nTotal, nModified, nAdded, nRemoved } = await computeDiff(table)
          if (nTotal > 0) {
            console.log(`${nTotal} changes in ${table}:`)
            console.log(`     ${nModified} modified`)
            console.log(`     ${nAdded} added`)
            console.log(`     ${nRemoved} removed`)
          }
        }
      }
      logEnd(topic)
    } else {
      console.log(`The ${topic} hasn't change. Skipping execution with SKIP_UNCHANGED=1!`)
    }
  }
}

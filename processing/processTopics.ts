import { type Topic } from './topics.const'
import { backupTable, computeDiff, dropDiffTable, getSchemaTables } from './utils/diffing'
import { directoryHasChanged, updateDirectoryHash } from './utils/hashing'
import { params } from './utils/parameters'
import { TOPIC_DIR } from './directories.const'
import { join } from 'path'
import { $ } from 'bun'
import { filteredFile } from './filter'
import { getTopicTables } from './utils/diffing'
import { logEnd, logStart } from './utils/logging'

const mainFile = (topic: Topic) => join(TOPIC_DIR, topic, topic)

async function runSQL(topic: Topic) {
  const psqlFile = `${mainFile(topic)}.sql`

  if (await Bun.file(psqlFile).exists()) {
    const logId = `Run SQL ${topic}`
    console.time(logId)
    return $`psql -q -f ${psqlFile}`.then(() => console.timeEnd(logId))
  }
}

async function runLua(fileName: string, topic: Topic) {
  const filePath = filteredFile(fileName)
  const logId = `Run LUA ${topic}`
  const luaFile = `${mainFile(topic)}.lua`

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
  fileChanged: boolean
) {
  const processedTables = await getSchemaTables('public')
  const backedUpTables = await getSchemaTables('backup')

  // drop all previous diffs
  processedTables.forEach(dropDiffTable)

  // when the helpers have changed we disable all diffing functionality
  const diffingPossible = !(await directoryHasChanged('helper')) && !fileChanged
  updateDirectoryHash('helper')

  for (const topic of topics) {
    if (params.skipUnchanged && (await directoryHasChanged(topic))) {
      logStart(topic)

      // get all tables related to `topic` and are already present in our db
      const topicTables = (await getTopicTables(topic)).filter((table) =>
        processedTables.has(table)
      )

      if (diffingPossible && params.computeDiffs) {
        await Promise.all(
          topicTables
            .filter((table) => !params.freezeData || !backedUpTables.has(table))
            .map(async (table) => {
              backedUpTables.add(table)
              return backupTable(table)
            })
        )
      }

      await runTopic(fileName, topic)

      updateDirectoryHash(topic)

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

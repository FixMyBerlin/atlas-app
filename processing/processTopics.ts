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
    return $`psql -q -f ${psqlFile}`
  }
}

async function runLua(fileName: string, topic: Topic) {
  const filePath = filteredFile(fileName)
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
  diffChanges: boolean,
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

  for (const topic of topics) {
    const topicChanged = await directoryHasChanged(topicPath(topic))
    const skipCode = params.skipUnchanged && !topicChanged && !helpersChanged
    if (skipCode) {
      logStart(topic)

      // get all tables related to `topic` that are already present in our db
      const topicTables = (await getTopicTables(topic)).filter((table) =>
        processedTables.has(table),
      )

      // backup all tables related to topic
      if (diffChanges) {
        await Promise.all(
          topicTables
            .filter((table) => !params.freezeData || !backedUpTables.has(table))
            .map(async (table) => {
              backedUpTables.add(table)
              return backupTable(table)
            }),
        )
      }

      // run the topic with osm2pgsql and the sql post-processing
      await runTopic(fileName, topic)

      // update the code hashes
      updateDirectoryHash(topicPath(topic))

      // compute diffs
      if (diffChanges) {
        const diffResults = await Promise.all(
          topicTables.map((table) =>
            computeDiff(table).then((diffResult) => ({ table, ...diffResult })),
          ),
        )
        diffResults
          .filter(({ nTotal }) => nTotal > 0)
          .forEach(({ table, nTotal, nModified, nAdded, nRemoved }) => {
            console.log(`${nTotal} changes in ${table}:`)
            console.log(`     ${nModified} modified`)
            console.log(`     ${nAdded} added`)
            console.log(`     ${nRemoved} removed`)
          })
      }
      logEnd(topic)
    } else {
      console.log(`The ${topic} hasn't change. Skipping execution with SKIP_UNCHANGED=1!`)
    }
  }
}

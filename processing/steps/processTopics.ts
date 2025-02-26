import { $ } from 'bun'
import { join } from 'path'
import { TOPIC_DIR } from '../constants/directories.const'
import { topicList, type Topic } from '../constants/topics.const'
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
import { synologyLogInfo } from '../utils/synology'
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
  const exists = await Bun.file(psqlFile).exists()

  if (exists) {
    try {
      console.log(`Running SQL ${psqlFile}`)
      console.time(`Running SQL ${psqlFile}`)
      await $`psql -q -f ${psqlFile}`
      console.timeEnd(`Running SQL ${psqlFile}`)
    } catch (error) {
      throw new Error(`Failed to run SQL file "${psqlFile}": ${error}`)
    }
  }
}

/**
 * Run the given topic's lua file with osm2pgsql on the given file
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
  } catch (error) {
    throw new Error(`Failed to run lua file "${luaFile}": ${error}`)
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
 */
export async function processTopics(fileName: string, fileChanged: boolean) {
  const tableListPublic = await getSchemaTables('public')
  const tableListBackup = await getSchemaTables('backup')
  const processedTables = new Set<string>()

  // drop all previous diffs
  if (!params.freezeData) {
    tableListPublic.forEach(dropDiffTable)
  }

  // when the helpers have changed we disable all diffing functionality
  const helpersChanged = await directoryHasChanged(topicPath('helper'))
  updateDirectoryHash(topicPath('helper'))
  if (helpersChanged) {
    console.log('Helpers have changed. Rerunning all code.')
  }

  const skipCode = params.skipUnchanged && !helpersChanged && !fileChanged
  const diffChanges = params.computeDiffs && !fileChanged

  logStart('Processing Topics')

  try {
    const response = await fetch(params.fileURL.toString(), { method: 'HEAD' })
    const lastModified = response.headers.get('Last-Modified')
    const lastModifiedDate = lastModified ? new Date(lastModified).toISOString() : undefined
    synologyLogInfo(`Processing file from ${lastModifiedDate || 'UNKOWN_DATE'}`)
  } catch (error) {
    console.log('ERROR logging the lastModified date', error)
  }

  for (const topic of topicList) {
    // Get all tables related to `topic`
    // This needs to happen first, so `processedTables` includes what we skip below
    const topicTables = await getTopicTables(topic)
    topicTables.forEach((table) => processedTables.add(table))

    // Guard
    const topicChanged = await directoryHasChanged(topicPath(topic))
    if (skipCode && !topicChanged) {
      console.log(
        `⏩ Skipping topic "${topic}".`,
        "The code hasn't changed and `SKIP_UNCHANGED` is active.",
      )
      continue
    }

    logStart(`Topic "${topic}"`)
    const processedTopicTables = topicTables.intersection(tableListPublic)

    // Backup all tables related to topic
    if (diffChanges) {
      // With `freezeData=true` (which is `FREEZE_DATA=1`) we only backup tables that are not already backed up (making sure the backup is complete).
      // Which means existing backup tables don't change (are frozen).
      // Learn more in [processing/README](../../processing/README.md#reference)
      const toBackup = params.freezeData
        ? processedTopicTables.difference(tableListBackup)
        : processedTopicTables
      await Promise.all(Array.from(toBackup).map(backupTable))
    }

    // Run the topic with osm2pgsql and the sql post-processing
    await runTopic(fileName, topic)

    // Update the code hashes
    updateDirectoryHash(topicPath(topic))

    // Update the diff tables
    if (diffChanges) {
      await diffTables(Array.from(processedTopicTables))
    }

    logEnd(`Topic "${topic}"`)
  }

  const timeElapsed = logEnd('Processing Topics')
  return { timeElapsed, processedTables: Array.from(processedTables) }
}

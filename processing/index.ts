import { topicList } from './constants/topics.const'
import { downloadFile, waitForFreshData } from './steps/download'
import {
  clearCache,
  restartTileServer,
  triggerCacheWarming,
  triggerPostProcessing,
} from './steps/externalTriggers'
import { idFilter, tagFilter } from './steps/filter'
import { generateTypes } from './steps/generateTypes'
import { writeMetadata } from './steps/metadata'
import { processTopics } from './steps/processTopics'
import { setup } from './steps/setup'
import { logTileInfo } from './utils/logging'
import { params } from './utils/parameters'
import { synologyLogError } from './utils/synology'

async function main() {
  try {
    // Setup directories and backup schema
    await setup()

    // Wait for fresh data
    if (params.waitForFreshData) {
      await waitForFreshData(params.fileURL, 24, 10)
    }

    // Download osm file
    let { fileName, fileChanged } = await downloadFile(params.fileURL)

    // Filter osm file with /filter/filter-expressions.txt
    await tagFilter(fileName, fileChanged)

    // Filter osm file by ids if given
    if (params.idFilter !== '') {
      fileName = await idFilter(fileName, params.idFilter)
      fileChanged = true
    }

    // Process topics
    const { timeElapsed: processingTime, processedTables } = await processTopics(
      topicList,
      fileName,
      fileChanged,
      params.skipUnchanged,
      params.computeDiffs,
      params.freezeData,
    )

    await generateTypes(params.environment, processedTables)
    await writeMetadata(fileName, processingTime)

    // Call the frontend update hook which registers sql functions and starts the analysis run
    await triggerPostProcessing()

    // Restart `tiles` container to refresh `/catalog`
    await restartTileServer()

    // Handle cache warming hook
    await clearCache()
    if (!params.skipWarmCache) {
      await triggerCacheWarming()
    }

    await logTileInfo(params.environment)
  } catch (error) {
    // This `catch` will only trigger if child functions are `await`ed AND file calls a `main()` function. Top level code does not work.
    synologyLogError(`Processing failed: ${error}`)
  }
}

main()

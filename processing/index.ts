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
import { logPadded, logTileInfo } from './utils/logging'
import { params } from './utils/parameters'
import { synologyLogError } from './utils/synology'

async function main() {
  try {
    await setup()
    logPadded('Processing')
    console.log('Processing:', 'Initilize')

    console.log('Processing:', 'Handle Data')
    await waitForFreshData()
    let { fileName, fileChanged } = await downloadFile()

    console.log('Processing:', 'Handle Filter')
    await tagFilter(fileName, fileChanged)
    const idFilterResponse = await idFilter(fileName, params.idFilter)
    if (idFilterResponse) ({ fileName, fileChanged } = idFilterResponse)

    console.log('Processing:', 'Handle Topics')

    // Process topics
    const { timeElapsed, processedTables } = await processTopics(topicList, fileName, fileChanged)

    await generateTypes(processedTables)
    await writeMetadata(fileName, timeElapsed)

    console.log('Processing:', 'Finishing up')
    // Call the frontend update hook which registers sql functions and starts the analysis run
    await triggerPostProcessing()

    // Restart `tiles` container to refresh `/catalog`
    await restartTileServer()

    // Handle cache warming hook
    await clearCache()
    if (!params.skipWarmCache) {
      await triggerCacheWarming()
    }

    logTileInfo()
  } catch (error) {
    // This `catch` will only trigger if child functions are `await`ed AND file calls a `main()` function. Top level code does not work.
    synologyLogError(`Processing failed: ${error}`)
  }
}

main()

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
import { params } from './utils/parameters'
import { synologyLogError } from './utils/synology'

try {
  // setup directories and backup schema
  await setup()

  // wait for fresh data
  if (params.waitForFreshData) {
    await waitForFreshData(params.fileURL, 24, 10)
  }

  // download osm file
  let { fileName, fileChanged } = await downloadFile(params.fileURL, params.skipDownload)

  // filter osm file with /filter/filter-expressions.txt
  await tagFilter(fileName, fileChanged)

  // filter osm file by ids if given
  if (params.idFilter !== '') {
    fileName = await idFilter(fileName, params.idFilter)
    fileChanged = true
  }

  // process topics
  const { timeElapsed: processingTime, processedTables } = await processTopics(
    topicList,
    fileName,
    fileChanged,
    params.skipUnchanged,
    params.computeDiffs,
    params.freezeData,
  )

  await generateTypes(params.environment, processedTables)

  // write runs metadata
  await writeMetadata(fileName, processingTime)

  // call the frontend update hook
  await triggerPostProcessing()

  // restart `tiles` container to refresh /catalog
  await restartTileServer()

  // clear the cache
  await clearCache()

  // call the cache warming hook
  if (!params.skipWarmCache) {
    triggerCacheWarming()
  }
} catch (e) {
  console.error(e)
  synologyLogError('Processing failed')
}

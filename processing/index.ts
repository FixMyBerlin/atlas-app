import { ID_FILTERED_FILE } from './directories.const'
import { downloadFile, waitForFreshData } from './steps/download'
import {
  clearCache,
  restartTileServer,
  triggerCacheWarming,
  triggerPostProcessing,
} from './steps/externalTriggers'
import { idFilter, tagFilter } from './steps/filter'
import { writeMetadata } from './steps/metadata'
import { processTopics } from './steps/processTopics'
import { setup } from './steps/setup'
import { topicList } from './topics.const'
import { params } from './utils/parameters'

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
if (params.idFilter && params.idFilter !== '') {
  await idFilter(fileName, params.idFilter)
  fileName = ID_FILTERED_FILE
  fileChanged = true
}

// process topics
const processingTime = await processTopics(
  topicList,
  fileName,
  fileChanged,
  params.skipUnchanged,
  params.computeDiffs,
  params.freezeData,
)

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

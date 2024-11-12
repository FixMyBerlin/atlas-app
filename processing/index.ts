import { FILTER_DIR, ID_FILTERED_FILE } from './directories.const'
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
import { directoryHasChanged, updateDirectoryHash } from './utils/hashing'
import { params } from './utils/parameters'

await setup()

if (params.waitForFreshData) {
  await waitForFreshData(params.fileURL, 24, 10)
}
let { fileName, fileChanged } = await downloadFile(params.fileURL, params.skipDownload)

// only run tag filters if the file or the filters have changed
const filtersChanged = await directoryHasChanged(FILTER_DIR)
if (fileChanged && !filtersChanged) {
  await tagFilter(fileName)
  updateDirectoryHash(FILTER_DIR)
}

if (params.idFilter && params.idFilter !== '') {
  await idFilter(fileName, params.idFilter)
  fileName = ID_FILTERED_FILE
  fileChanged = true
}

const processingTime = await processTopics(topicList, fileName, fileChanged)

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

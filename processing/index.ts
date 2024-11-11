import { $ } from 'bun'
import { FILTER_DIR, ID_FILTERED_FILE } from './directories.const'
import { downloadFile, waitForFreshData } from './download'
import { idFilter, tagFilter } from './filter'
import { processTopics } from './processTopics'
import { setup } from './setup'
import { topicList } from './topics.const'
import { directoryHasChanged, updateDirectoryHash } from './utils/hashing'
import { params } from './utils/parameters'

await setup()

if (params.waitForFreshData) {
  await waitForFreshData(params.fileURL, 24, 10)
}
const { fileName, fileChanged } = await downloadFile(params.fileURL, params.skipDownload)

if (fileChanged && !(await directoryHasChanged(FILTER_DIR))) {
  await tagFilter(fileName)
  updateDirectoryHash(FILTER_DIR)
}

if (params.idFilter && params.idFilter !== '') {
  await idFilter(fileName, params.idFilter)
  await processTopics(topicList, ID_FILTERED_FILE, false)
} else {
  const diffChanges = params.computeDiffs && !fileChanged
  await processTopics(topicList, fileName, diffChanges)
}

// await writeMetadata(fileName, 0)

// call the frontend update hook
try {
  await fetch(`http://app:4000/api/private/post-processing-hook?apiKey=${params.apiKey}`)
} catch {
  console.warn(
    'Calling the post processing hook failed. This is likely due to the NextJS application not running.',
  )
}

// restart `tiles` container to refresh /catalog
try {
  await $`docker restart tiles > /dev/null`
  console.log('Succesfully restarted the tiles container.')
} catch {
  throw new Error('Restarting the tiles container failed.')
}

// clear the cache
try {
  await $`rm -rf "/var/cache/nginx/*"`
  console.log('Succesfully cleared the cache.')
} catch {
  console.warn('Clearing the cache failed.')
}

// call the cache warming hook
if (!params.skipWarmCache) {
  try {
    await fetch(`http://app:4000api/private/warm-cache?apiKey=${params.apiKey}`)
  } catch {
    console.warn(
      'Calling the cache warming hook failed. This is likely due to the NextJS application not running.',
    )
  }
}

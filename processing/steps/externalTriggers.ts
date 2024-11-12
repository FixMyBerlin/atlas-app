import { $ } from 'bun'
import { params } from '../utils/parameters'

export async function triggerPostProcessing() {
  try {
    await fetch(`http://app:4000/api/private/post-processing-hook?apiKey=${params.apiKey}`)
  } catch {
    console.warn(
      'Calling the post processing hook failed. This is likely due to the NextJS application not running.',
    )
  }
}
export async function triggerCacheWarming() {
  try {
    await fetch(`http://app:4000api/private/warm-cache?apiKey=${params.apiKey}`)
  } catch {
    console.warn(
      'Calling the cache warming hook failed. This is likely due to the NextJS application not running.',
    )
  }
}

export async function clearCache() {
  try {
    await $`rm -rf "/var/cache/nginx/*"`
    console.log('Succesfully cleared the cache.')
  } catch {
    console.warn('Clearing the cache failed.')
  }
}

export async function restartTileServer() {
  try {
    await $`docker restart tiles > /dev/null`
    console.log('Succesfully restarted the tiles container.')
  } catch {
    throw new Error('Restarting the tiles container failed.')
  }
}

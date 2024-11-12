import { $ } from 'bun'
import { params } from '../utils/parameters'

async function triggerPrivateApi(endpoint: string) {
  try {
    const response = await fetch(`http://app:4000/api/private/${endpoint}?apiKey=${params.apiKey}`)
    if (!response.ok) {
      throw new Error(`The ${endpoint} endpoint failed with status code ${response.status}.`)
    }
  } catch {
    console.warn(
      `Calling the ${endpoint} hook failed. This is likely due to the NextJS application not running.`,
    )
  }
}
export async function triggerPostProcessing() {
  return triggerPrivateApi('post-processing-hook')
}
export async function triggerCacheWarming() {
  return triggerPrivateApi('cache-warming')
}

/**
 * Clears the cache of the nginx server.
 * This requires the /var/cache/nginx directory from the nginx container to be mounted in this container.
 */
export async function clearCache() {
  try {
    await $`rm -rf "/var/cache/nginx/*"`
    console.log('Succesfully cleared the cache.')
  } catch {
    console.warn('Clearing the cache failed.')
  }
}

/**
 * Restarts the tiles container to refresh the /catalog endpoint.
 * This requires that the docker socket is mounted in this container.
 */
export async function restartTileServer() {
  try {
    await $`docker restart tiles > /dev/null`
    console.log('Succesfully restarted the tiles container.')
  } catch {
    throw new Error('Restarting the tiles container failed.')
  }
}
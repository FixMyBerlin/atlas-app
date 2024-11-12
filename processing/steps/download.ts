import { basename, join } from 'path'
import { OSM_DOWNLOAD_DIR } from '../directories.const'
import { readPersistent, writePersistent } from '../utils/persistentData'
import { logError } from '../utils/synology'

/**
 * Get the full path to the downloaded file.
 * @param fileName file name
 * @returns full path to the file
 */
export const originalFilePath = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)

/**
 * Wait for the givien url to have todays date as last modified.
 * @param fileURL the url to check
 * @param maxTries the maximum number of tries
 * @param timeoutMinutes the timeout between tries in minutes
 * @returns true if the file has been updated today, false otherwise
 */
export async function waitForFreshData(fileURL: URL, maxTries: number, timeoutMinutes: number) {
  const todaysDate = new Date().toDateString()
  let tries = 0
  while (true) {
    // get last modified date
    const response = await fetch(fileURL.toString(), { method: 'HEAD' })
    const lastModified = response.headers.get('Last-Modified')
    if (!lastModified) {
      throw new Error('No Last-Modified header found')
    }

    // check if last modified date is today
    const lastModifiedDate = new Date(lastModified).toDateString()
    if (todaysDate === lastModifiedDate) {
      return true
    }

    tries++
    // if we exceeded the maximum number of tries, return false and log to synlogy
    if (tries >= maxTries) {
      logError(`Timeout exceeded while waiting for fresh data. File is from ${lastModifiedDate}`)
      return false
    }

    // wait for the timeout
    await new Promise((resolve) => setTimeout(resolve, timeoutMinutes * 1000 * 60))
  }
}

/**
 * Download a file from the given url and save it to the disk.
 * When the files eTag is the same as the last download, the download will be skipped.
 * @param fileURL the url to download from
 * @param skipIfExists  whether to skip the download if the file already exists
 * @returns the file name and whether the file has changed
 */
export async function downloadFile(fileURL: URL, skipIfExists: boolean) {
  const fileName = basename(fileURL.toString())
  const filePath = originalFilePath(fileName)
  const file = await Bun.file(filePath)
  const fileExists = await file.exists()

  // check if file already exists
  if (skipIfExists && fileExists) {
    console.log('Skipped download with the `SKIP_DOWNLOAD` flag')
    return { fileName, fileChanged: false }
  }

  // check if file has changed
  const eTag = await fetch(fileURL.toString(), { method: 'HEAD' }).then((response) =>
    response.headers.get('ETag'),
  )
  if (!eTag) {
    throw new Error('No ETag found')
  }

  if (eTag === (await readPersistent(fileName))) {
    return { fileName, fileChanged: false }
  }

  // download file and write to disc
  const response = await fetch(fileURL.toString())
  await Bun.write(file, response)

  // save etag
  writePersistent(fileName, eTag)

  return { fileName, fileChanged: true }
}
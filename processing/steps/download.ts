import { basename, join } from 'path'
import { OSM_DOWNLOAD_DIR } from '../constants/directories.const'
import { readPersistent, writePersistent } from '../utils/persistentData'
import { synologyLogError } from '../utils/synology'

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
      synologyLogError(
        `Timeout exceeded while waiting for fresh data. File is from ${lastModifiedDate}`,
      )
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

  // Check if file already exists
  if (fileExists && skipIfExists) {
    console.log('⏩ Skipping download. The file already exist and `SKIP_DOWNLOAD` is active.')
    return { fileName, fileChanged: false }
  }

  // Check if file has changed
  const eTag = await fetch(fileURL.toString(), { method: 'HEAD' }).then((response) =>
    response.headers.get('ETag'),
  )
  if (!eTag) {
    throw new Error('No ETag found')
  }
  if (fileExists && eTag === (await readPersistent(fileName))) {
    console.log('⏩ Skipped download because the file has not changed.')
    return { fileName, fileChanged: false }
  }

  // Download file and write to disc
  console.log(`Downloading file "${fileName}"...`)
  const response = await fetch(fileURL.toString())

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download file. Status code: ${response.statusText}`)
  }

  // We need to download the file as a stream to avoid memory issues
  const reader = response.body.getReader()
  const writer = file.writer()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    await writer.write(value)
  }
  writer.end()

  // Save etag
  writePersistent(fileName, eTag)

  return { fileName, fileChanged: true }
}

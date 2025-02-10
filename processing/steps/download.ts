import { $ } from 'bun'
import { basename, join } from 'path'
import { OSM_DOWNLOAD_DIR } from '../constants/directories.const'
import { params } from '../utils/parameters'
import { readPersistent, writePersistent } from '../utils/persistentData'
import { synologyLogError } from '../utils/synology'

/**
 * Get the full path to the downloaded file.
 * @returns full path to the file
 */
export const originalFilePath = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)

/**
 * Wait for the givien url to have todays date as last modified.
 * @returns true if the file has been updated today, false otherwise
 */
export async function waitForFreshData() {
  if (!params.waitForFreshData) {
    console.log('Skipping `waitForFreshData` due to `WAIT_FOR_FRESH_DATA=0`')
    return
  }

  const maxTries = 30 // 7,5 hours (at 15 Min per try)
  const timeoutMinutes = 15
  const todaysDate = new Date().toDateString()
  let tries = 0

  while (true) {
    // Get last modified date
    const response = await fetch(params.fileURL.toString(), { method: 'HEAD' })
    const lastModified = response.headers.get('Last-Modified')
    if (!lastModified) {
      throw new Error('No Last-Modified header found')
    }

    // Check if last modified date is today
    const lastModifiedDate = new Date(lastModified).toDateString()
    if (todaysDate === lastModifiedDate) {
      return true
    }

    tries++
    // If we exceeded the maximum number of tries, return false and log to Synology
    if (tries >= maxTries) {
      synologyLogError(
        `Timeout exceeded while waiting for fresh data. File is from ${new Date(lastModified).toISOString()}`,
      )
      return false
    }

    // Wait for the timeout
    await new Promise((resolve) => setTimeout(resolve, timeoutMinutes * 1000 * 60))
  }
}

/**
 * Download the file from the configured url and save it to the disk.
 * When the files eTag is the same as the last download, the download will be skipped.
 */
export async function downloadFile() {
  const downloadUrl = params.fileURL.toString()
  const fileName = basename(downloadUrl)
  const filePath = originalFilePath(fileName)
  const fileExists = await Bun.file(filePath).exists()

  // Check if file already exists
  if (fileExists && params.skipDownload) {
    console.log('⏩ Skipping download. The file already exist and `SKIP_DOWNLOAD` is active.')
    return { fileName, fileChanged: false }
  }

  // Check if file has changed
  const eTag = await fetch(downloadUrl, { method: 'HEAD' }).then((response) =>
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
  try {
    await $`wget --quiet --output-document=${filePath} ${downloadUrl}`
  } catch (error) {
    throw new Error(
      `Failed to download file with \`wget --quiet --output-document=${filePath} ${downloadUrl}\``,
    )
  }

  // Save etag
  writePersistent(fileName, eTag)

  return { fileName, fileChanged: true }
}

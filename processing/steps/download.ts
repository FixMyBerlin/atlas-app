import { basename, join } from 'path'
import { OSM_DOWNLOAD_DIR } from '../directories.const'
import { readPersistent, writePersistent } from '../utils/persistentData'
export async function waitForFreshData(fileURL: URL, maxTries: number, timeout: number) {
  const todaysDate = new Date().toDateString()
  let tries = 0
  while (true) {
    const response = await fetch(fileURL.toString(), { method: 'HEAD' })
    const lastModified = response.headers.get('Last-Modified')
    if (lastModified) {
      if (todaysDate === new Date(lastModified).toDateString()) {
        return true
      }
    }

    tries++

    if (tries >= maxTries) {
      return false
    }
    await new Promise((resolve) => setTimeout(resolve, timeout * 1000 * 60))
  }
}

export async function downloadFile(fileURL: URL, skipIfExists: boolean) {
  const fileName = basename(fileURL.toString())
  const filePath = join(OSM_DOWNLOAD_DIR, fileName)
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

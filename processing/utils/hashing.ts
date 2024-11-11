import { $ } from 'bun'
import { join } from 'path'
import { TOPIC_DIR } from '../directories.const'
import { readPersistent, writePersistent } from './persistentData'

async function computeDirectoryHash(directory: string) {
  const directoryPath = join(TOPIC_DIR, directory)
  return $`find "${directoryPath}" -type f | sort | xargs shasum`.text()
}

export async function updateDirectoryHash(directory: string) {
  return writePersistent(directory, await computeDirectoryHash(directory))
}
export async function directoryHasChanged(directory: string) {
  const oldHash = await readPersistent(directory)
  const newHash = await computeDirectoryHash(directory)
  return oldHash !== newHash
}

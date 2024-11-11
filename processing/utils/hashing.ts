import { $ } from 'bun'
import { readPersistent, writePersistent } from './persistentData'

async function computeDirectoryHash(path: string) {
  return $`find "${path}" -type f | sort | xargs shasum`.text()
}

export async function updateDirectoryHash(path: string) {
  return writePersistent(path, await computeDirectoryHash(path))
}
export async function directoryHasChanged(path: string) {
  const oldHash = await readPersistent(path)
  const newHash = await computeDirectoryHash(path)
  return oldHash !== newHash
}

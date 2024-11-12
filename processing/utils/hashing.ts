import { $ } from 'bun'
import { readPersistent, writePersistent } from './persistentData'

/**
 * Compute the hash(es) of a directory. It iterates all files recursively and sorts them before hashing.
 * @param path The path to the directory
 * @returns The hash of the directory
 */
async function computeDirectoryHash(path: string) {
  return $`find "${path}" -type f | sort | xargs shasum`.text()
}

/**
 * Save the directorys hash on the disk.
 * @param path The path to the directory
 */
export async function updateDirectoryHash(path: string) {
  return writePersistent(path, await computeDirectoryHash(path))
}

/**
 * Compare the saved hash with the current hash of the directory.
 * @param path The path to the directory
 * @returns
 */
export async function directoryHasChanged(path: string) {
  const oldHash = await readPersistent(path)
  const newHash = await computeDirectoryHash(path)
  return oldHash !== newHash
}
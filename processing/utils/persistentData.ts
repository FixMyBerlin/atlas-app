import { HASHES_DIR } from '../directories.const'
import { join } from 'path'

const filePath = (id: string) => join(HASHES_DIR, id)

export async function readPersistent(id: string) {
  const file = await Bun.file(filePath(id))
  if (await file.exists()) {
    return file.text()
  }
  return ''
}

export async function writePersistent(id: string, data: string) {
  const file = await Bun.file(filePath(id))
  return Bun.write(file, data)
}

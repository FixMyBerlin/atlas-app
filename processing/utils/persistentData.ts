import { join } from 'path'
import { PERSISTENT_DIR } from '../directories.const'

const filePath = (id: string) => join(PERSISTENT_DIR, id)

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

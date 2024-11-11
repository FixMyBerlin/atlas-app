import { $ } from 'bun'
import { HASHES_DIR, OSM_DOWNLOAD_DIR, OSM_FILTER_DIR } from './directories.const'
import { createBackupSchema } from './utils/diffing'

export async function setup() {
  //create directories and backup schema
  const directoryPromise = $`mkdir -p ${OSM_DOWNLOAD_DIR} ${OSM_FILTER_DIR} ${HASHES_DIR}`
  const schemaPromise = createBackupSchema()
  return Promise.all([directoryPromise, schemaPromise])
}

import { $ } from 'bun'
import { OSM_DOWNLOAD_DIR, OSM_FILTERED_DIR, PERSISTENT_DIR } from '../directories.const'
import { createBackupSchema } from '../utils/diffing'
import { createMetadataTable } from './metadata'

export async function setup() {
  //create directories and backup schema
  const directoryPromise = $`mkdir -p ${OSM_DOWNLOAD_DIR} ${OSM_FILTERED_DIR} ${PERSISTENT_DIR}`
  const schemaPromise = createBackupSchema()
  const metadataTablePromise = createMetadataTable()
  return Promise.all([directoryPromise, schemaPromise, metadataTablePromise])
}

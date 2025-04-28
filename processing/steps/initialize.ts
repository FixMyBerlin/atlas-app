import { $ } from 'bun'
import { OSM_DOWNLOAD_DIR, OSM_FILTERED_DIR, PERSISTENT_DIR } from '../constants/directories.const'
import { initializeBackupSchema } from '../utils/diffing'
import { initializeCustomFunctions } from '../utils/initializeCustomFunctions'
import { initializeMetadataTable } from './metadata'

/** Initialize Folder, Schema, Functions, Tables */
export async function initialize() {
  const directoryPromise = $`mkdir -p ${OSM_DOWNLOAD_DIR} ${OSM_FILTERED_DIR} ${PERSISTENT_DIR}`
  const schemaPromise = initializeBackupSchema()
  const customFunctionsPromises = initializeCustomFunctions()
  const metadataTablePromise = initializeMetadataTable()

  return Promise.all([
    directoryPromise,
    schemaPromise,
    customFunctionsPromises,
    metadataTablePromise,
  ])
}

import { $ } from 'bun'
import { OSM_DOWNLOAD_DIR, OSM_FILTERED_DIR, PERSISTENT_DIR } from '../constants/directories.const'
import { initializeBackupSchema } from '../utils/diffing'
import { initializeCustomFunctions } from '../utils/initializeCustomFunctions'
import { initializeMetadataTable } from './metadata'

/** Initialize Folder, Schema, Custom SQL Functions, Tables */
export async function initialize() {
  await $`mkdir -p ${OSM_DOWNLOAD_DIR} ${OSM_FILTERED_DIR} ${PERSISTENT_DIR}`
  await initializeBackupSchema()
  await initializeCustomFunctions()
  await initializeMetadataTable()

  return true
}

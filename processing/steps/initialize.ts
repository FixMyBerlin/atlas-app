import { $ } from 'bun'
import { OSM_DOWNLOAD_DIR, OSM_FILTERED_DIR, PERSISTENT_DIR } from '../constants/directories.const'
import { initializeCustomFunctionsDataTables, initializeSchemaData } from '../dataTables/dataTables'
import { initializeCustomFunctionDiffing, initializeSchemaBackup } from '../diffing/diffing'
import { initializeMetadataTable } from './metadata'

/** Initialize Folder, Schema, Custom SQL Functions, Tables */
export async function initialize() {
  await $`mkdir -p ${OSM_DOWNLOAD_DIR} ${OSM_FILTERED_DIR} ${PERSISTENT_DIR}`

  // See ./diffing
  await initializeSchemaBackup()
  await initializeCustomFunctionDiffing()

  // See ../dataTables
  await initializeSchemaData()
  await initializeCustomFunctionsDataTables()

  // Meta Data
  await initializeMetadataTable()

  return true
}

import { $ } from 'bun'
import { join } from 'path'
import {
  FILTER_DIR,
  FILTER_EXPRESSIONS,
  ID_FILTERED_FILE,
  OSM_DOWNLOAD_DIR,
  OSM_FILTER_DIR,
} from '../directories.const'
import { directoryHasChanged, updateDirectoryHash } from '../utils/hashing'

const downloadFile = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)
export const filteredFile = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)
export async function tagFilter(fileName: string, fileChanged: boolean) {
  const filtersChanged = await directoryHasChanged(FILTER_DIR)
  // only run tag filters if the file or the filters have changed
  if (fileChanged || filtersChanged) {
    await $`osmium tags-filter \
                --overwrite \
                --expressions ${FILTER_EXPRESSIONS} \
                --output=${filteredFile(fileName)} \
                ${downloadFile(fileName)}`
  }

  return updateDirectoryHash(FILTER_DIR)
}

export async function idFilter(fileName: string, ids: string) {
  return $`osmium getid \
            --overwrite \
            --output=${join(OSM_FILTER_DIR, ID_FILTERED_FILE)} \
            --verbose-ids ${filteredFile(fileName)} \
            ${ids}`
}

import {
  FILTER_EXPRESSIONS,
  ID_FILTERED_FILE,
  OSM_DOWNLOAD_DIR,
  OSM_FILTER_DIR,
} from './directories.const'
import { join } from 'path'
import { $ } from 'bun'

const downloadFile = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)
export const filteredFile = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)
export function tagFilter(fileName: string) {
  return $`osmium tags-filter \
              --overwrite \
              --expressions ${FILTER_EXPRESSIONS} \
              --output=${filteredFile(fileName)} \
              ${downloadFile(fileName)}`
}

export async function idFilter(fileName: string, ids: string) {
  return $`osmium getid \
            --overwrite \
            --output=${join(OSM_FILTER_DIR, ID_FILTERED_FILE)} \
            --verbose-ids ${filteredFile(fileName)} \
            ${ids}`
}

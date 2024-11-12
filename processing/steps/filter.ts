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
import { originalFilePath } from './download'

/**
 * Get the full path to the filtered file.
 * @param fileName file name
 * @returns full path to the file
 */
export const filteredFilePath = (fileName: string) => join(OSM_DOWNLOAD_DIR, fileName)

/**
 * Filter the OSM file wiht osmiumm and the given filter expressions.
 * The filter expressions are defined in /filter/filter-expressions.txt
 * @param fileName the file to filter
 * @param fileChanged whether that file changed since the last run
 * @returns the resulting file's name
 */
export async function tagFilter(fileName: string, fileChanged: boolean) {
  // only run tag filters if the file or the filters have changed
  const filtersChanged = await directoryHasChanged(FILTER_DIR)
  if (fileChanged || filtersChanged) {
    await $`osmium tags-filter \
                --overwrite \
                --expressions ${FILTER_EXPRESSIONS} \
                --output=${filteredFilePath(fileName)} \
                ${originalFilePath(fileName)}`
  } else {
    console.log('Skipping tag filter because the file and the filters have not changed!')
  }

  updateDirectoryHash(FILTER_DIR)

  return fileName
}

/**
 * Filter the OSM file with osmium and the given ids.
 * @param fileName the file to filter
 * @param ids the ids to filter
 * @returns the resulting file's name
 */
export async function idFilter(fileName: string, ids: string) {
  await $`osmium getid \
            --overwrite \
            --output=${join(OSM_FILTER_DIR, ID_FILTERED_FILE)} \
            --verbose-ids ${filteredFilePath(fileName)} \
            ${ids}`

  return ID_FILTERED_FILE
}

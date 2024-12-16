import { $ } from 'bun'
import { FILTER_DIR, FILTER_EXPRESSIONS, ID_FILTERED_FILE } from '../constants/directories.const'
import { directoryHasChanged, updateDirectoryHash } from '../utils/hashing'
import { originalFilePath } from './download'

/**
 * Get the full path to the filtered file.
 * @param fileName file name
 * @returns full path to the file
 */
// FILTERING DISABLED
// export const filteredFilePath = (fileName: string) => join(OSM_FILTERED_DIR, fileName)
export const filteredFilePath = (fileName: string) => originalFilePath(fileName)

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
    console.log('Filtering the OSM file...')
    try {
      Bun.spawnSync(
        [
          'osmium',
          'tags-filter',
          '--overwrite',
          '--expressions',
          FILTER_EXPRESSIONS,
          `--output=${filteredFilePath(fileName)}`,
          originalFilePath(fileName),
        ],
        {
          onExit(_proc, exitCode, _signalCode, error) {
            exitCode && console.log('exitCode:', exitCode)
            error && console.log('error:', error)
          },
        },
      )
      // NOTE: Fails with…
      //    processing  | PBF error: invalid BlobHeader size (> max_blob_header_size)
      //    processing  | 33 |                   --overwrite \
      //    processing  | 34 |                   --expressions ${FILTER_EXPRESSIONS} \
      //    processing  | 35 |                   --output=${filteredFilePath(fileName)} \
      //    processing  | 36 |                   ${originalFilePath(fileName)}`
      //    processing  | 37 |     } catch (error) {
      //    processing  | 38 |       throw new Error(`Failed to filter the OSM file: ${error}`)
      //    processing  |                  ^
      //    processing  | error: Failed to filter the OSM file: ShellError: Failed with exit code 1
      //    processing  |       at /processing/steps/filter.ts:38:13
      // await $`osmium tags-filter \
      //             --overwrite \
      //             --expressions ${FILTER_EXPRESSIONS} \
      //             --output=${filteredFilePath(fileName)} \
      //             ${originalFilePath(fileName)}`
    } catch (error) {
      throw new Error(`Failed to filter the OSM file: ${error}`)
    }
  } else {
    console.log('⏩ Skipping tag filter. The file and filters are unchanged.')
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
  try {
    await $`osmium getid \
              --overwrite \
              --output=${filteredFilePath(ID_FILTERED_FILE)} \
              --verbose-ids ${filteredFilePath(fileName)} \
              ${ids}`
  } catch (error) {
    throw new Error(`Failed to filter the OSM file by ids: ${error}`)
  }

  return ID_FILTERED_FILE
}

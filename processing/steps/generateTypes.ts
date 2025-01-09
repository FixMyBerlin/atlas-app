import { $ } from 'bun'
import { join } from 'path'
import { TYPES_DIR } from '../constants/directories.const'
import { params } from '../utils/parameters'

export function generateTableIdType(processedTables: string[]) {
  const unionString = processedTables
    .sort()
    .map((tableName) => `'${tableName}'`)
    .join(' | ')
  return `export type TableId = ${unionString}`
}

/**
 * Generate types based on the processing tables.
 * @param processedTables the list of tables to include in the type
 */
export async function generateTypes(processedTables: string[]) {
  // Only generate type when in development
  if (params.environment !== 'development') return

  console.log('Generating types...')
  const typeFilePath = join(TYPES_DIR, 'tableId.ts')
  const tableIdType = generateTableIdType(processedTables)
  const typeFile = Bun.file(typeFilePath)
  await Bun.write(typeFile, tableIdType)
  try {
    await $`bunx prettier -w --config=/processing/.prettierrc ${TYPES_DIR} > /dev/null`
  } catch (error) {
    throw new Error(`Failed to run prettier on auto generated types: ${error}`)
  }
}

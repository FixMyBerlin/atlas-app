import { $ } from 'bun'
import { join } from 'path'
import { TYPES_DIR } from '../constants/directories.const'
import { params } from '../utils/parameters'

/**
 * Generate types based on the processing tables.
 * @param processedTables the list of tables to include in the type
 */
export async function generateTypes(processedTables: string[]) {
  // Only generate type when in development
  if (params.environment !== 'development') return

  console.log('Generating types...')

  writeTableIdTypes(processedTables)

  autoformatTypeFiles()
}

async function writeTableIdTypes(processedTables: string[]) {
  const typeFilePath = join(TYPES_DIR, 'tableId.ts')
  const typeFile = Bun.file(typeFilePath)

  const fileContent = `export type TableId = ${
    processedTables
      .sort()
      .map((tableName) => `'${tableName}'`)
      .join(' | ') || 'ERROR'
  }`

  await Bun.write(typeFile, fileContent)
}

async function autoformatTypeFiles() {
  try {
    await $`bunx prettier -w --config=/processing/.prettierrc ${TYPES_DIR} > /dev/null`
  } catch (error) {
    throw new Error(`Failed to run prettier on auto generated types: ${error}`)
  }
}

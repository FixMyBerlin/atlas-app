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
  writeTodoIdTypes()

  autoformatTypeFiles()
}

async function writeTableIdTypes(processedTables: string[]) {
  const typeFilePath = join(TYPES_DIR, 'tableId.generated.const.ts')
  const typeFile = Bun.file(typeFilePath)

  const fileContent = `export type TableId = ${
    processedTables
      .sort()
      .map((tableName) => `'${tableName}'`)
      .join(' | ') || 'ERROR'
  }`

  const content = prefixGeneratedFiles(fileContent)
  await Bun.write(typeFile, content)
}

async function callLuaForNames(luaFilename: 'ExtractBikelaneTodos' | 'ExtractRoadTodos') {
  try {
    const rawResult = await $`lua /processing/utils/types/${luaFilename}.lua`.text()
    const lines = rawResult.split('\n').filter(Boolean).sort()
    const result = lines
      .map((line) => line.split(';'))
      .map(([id, todoTableOnly]) => {
        return { id, todoTableOnly: JSON.parse(todoTableOnly) as boolean }
      })
    return result
  } catch (error) {
    throw new Error(`Failed to get names for "${luaFilename}": ${error}`)
  }
}

async function writeTodoIdTypes() {
  const typeFilePath = join(TYPES_DIR, 'todoId.generated.const.ts')
  const typeFile = Bun.file(typeFilePath)

  const bikelaneTodoNames = await callLuaForNames('ExtractBikelaneTodos')
  const bikelaneTodoNamesTableAndField = bikelaneTodoNames
    .filter((e) => e.todoTableOnly === false)
    .map((e) => e.id)
  const bikelaneTodoNamesTableOnly = bikelaneTodoNames
    .filter((e) => e.todoTableOnly === true)
    .map((e) => e.id)

  const roadTodoNames = await callLuaForNames('ExtractRoadTodos')
  const roadTodoNamesTableAndField = roadTodoNames
    .filter((e) => e.todoTableOnly === false)
    .map((e) => e.id)
  const roadTodoNamesTableOnly = roadTodoNames
    .filter((e) => e.todoTableOnly === true)
    .map((e) => e.id)

  const fileContent = `
  export const bikelaneTodoIdsTableAndField = [${bikelaneTodoNamesTableAndField.map((name) => `'${name}'`).join(',')}] as const
  export type BikelaneTodoIdTableAndField = (typeof bikelaneTodoIdsTableAndField)[number]

  export const bikelaneTodoIdsTableOnly = [${bikelaneTodoNamesTableOnly.map((name) => `'${name}'`).join(',')}] as const
  export type BikelaneTodoIdTableOnly = (typeof bikelaneTodoIdsTableOnly)[number]

  export const roadTodoIdsTableAndField = [${roadTodoNamesTableAndField.map((name) => `'${name}'`).join(',')}] as const
  export type RoadTodoIdTableAndField = (typeof roadTodoIdsTableAndField)[number]

  export const roadTodoIdsTableOnly = [${roadTodoNamesTableOnly.map((name) => `'${name}'`).join(',')}] as const
  export type RoadTodoIdTableOnly = (typeof roadTodoIdsTableOnly)[number]
  `

  const content = prefixGeneratedFiles(fileContent)
  await Bun.write(typeFile, content)
}

function prefixGeneratedFiles(content: string) {
  return `// DO NOT EDIT MANUALLY
// This file was automatically generated by \`processing/steps/generateTypes.ts\`
// To update, run \`docker compose up processing\`

${content}
`
}

async function autoformatTypeFiles() {
  try {
    await $`bunx prettier -w --config=/processing/.prettierrc ${TYPES_DIR} > /dev/null`
  } catch (error) {
    throw new Error(`Failed to run prettier on auto generated types: ${error}`)
  }
}

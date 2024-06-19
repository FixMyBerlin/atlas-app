#!/usr/bin/env bun

// This script generates the files `./_{checksum}.ts` and `./index.ts`
// don't run it directly but use `npm run save-configs` which run prettier after code generation

import path from 'node:path'
import fs from 'node:fs'
import { getSimplifiedConfigs } from './lib'

const configsFolder = path.join(import.meta.dir, 'configs')

const top = `
    // DO NOT EDIT MANUALLY
    // this file was automatically generated by \`${import.meta.file}\`
  `

Object.entries(getSimplifiedConfigs()).forEach(([checksum, simplifiedConfig]) => {
  const moduleName = `_${checksum}`
  const modulePath = path.join(configsFolder, `${moduleName}.ts`)
  let code =
    top +
    `
      import { MapDataCategoryParam } from '../../type'

    `
  code += `export const ${moduleName}: MapDataCategoryParam[] = ${JSON.stringify(simplifiedConfig)}`
  Bun.write(modulePath, code)
  console.log(`Updated ${modulePath}...`)
})

const configModules = fs
  .readdirSync(configsFolder)
  .filter((filename) => filename.startsWith('_'))
  .map((filename) => filename.split('.')[0])
  .sort()

const importCode = configModules
  .map((moduleName) => `import { ${moduleName} } from './${moduleName}'`)
  .join('\n')

const exportCode =
  'export const configs = {' +
  configModules.map((filename) => `"${filename!.slice(1)}": ${filename}`) +
  '}'
const modulePath = path.join(configsFolder, 'index.ts')
Bun.write(modulePath, [top, importCode, '', exportCode].join('\n'))
console.log(`Updated ${modulePath}...`)

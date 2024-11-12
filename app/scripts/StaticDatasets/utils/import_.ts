import fs from 'node:fs'
import path from 'node:path'
import { yellow } from './log'

/** @returns Object or Function | null */
export const import_ = async <ReturnModule extends Function | Object>(
  folderName: string,
  moduleName: string,
  valueName: string,
) => {
  const moduleFileName = `${moduleName}.ts`
  const moduleFullFilename = path.join(folderName, moduleFileName)

  if (!fs.existsSync(moduleFullFilename)) {
    return null
  }

  const module_ = await import(moduleFullFilename)

  if (!(valueName in module_)) {
    yellow(`  ${moduleFileName} does not export value "${valueName}".`)
    return null
  }
  return module_[valueName] as ReturnModule
}

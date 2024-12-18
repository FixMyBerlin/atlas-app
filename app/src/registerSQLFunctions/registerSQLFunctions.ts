import { exportApiIdentifier } from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import chalk from 'chalk'
import { registerExportFunctions } from './registerExportFunctions'
import { registerGeneralizationFunctions } from './registerGeneralizationFunctions'

export async function registerSQLFunctions() {
  try {
    const greenCheckmark = chalk.bold(chalk.green(' ✓'))
    const exportFunctionPromise = registerExportFunctions(exportApiIdentifier).then(() =>
      console.log(greenCheckmark, 'Export functions registered'),
    )
    const generalizationFunctionPromise = registerGeneralizationFunctions().then(() =>
      console.log(greenCheckmark, 'Generalization functions registered'),
    )
    await Promise.all([exportFunctionPromise, generalizationFunctionPromise])
  } catch (e) {
    console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
  }
}

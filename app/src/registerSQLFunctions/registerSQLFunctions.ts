import { exportApiIdentifier } from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { interactivityConfiguration } from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/interacitvityConfiguartion'
import chalk from 'chalk'
import { registerExportFunctions } from './registerExportFunctions'
import { registerGeneralizationFunctions } from './registerGeneralizationFunctions'
// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function registerSQLFunctions() {
  try {
    const greenCheckmark = chalk.bold(chalk.green(' ✓'))
    const exportFunctionPromise = registerExportFunctions(exportApiIdentifier).then(() =>
      console.log(greenCheckmark, 'Export functions registered'),
    )
    const generalizationFunctionPromise = registerGeneralizationFunctions(
      interactivityConfiguration,
    ).then(() => console.log(greenCheckmark, 'Generalization functions registered'))
    return Promise.all([exportFunctionPromise, generalizationFunctionPromise])
  } catch (e) {
    console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
  }
}

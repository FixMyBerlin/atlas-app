import chalk from 'chalk'
import { exportApiIdentifier } from './app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { interactivityConfiguration } from './app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/interacitvityConfiguartion'
import { registerCustomFunctions } from './instrumentation/registerCustomFunctions'
import { registerExportFunctions } from './instrumentation/registerExportFunctions'
import { registerGeneralizationFunctions } from './instrumentation/registerGeneralizationFunctions'
import { runAnalysis } from './instrumentation/runAnalysis'
// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const greenHook = chalk.bold(chalk.green(' ✓'))
      await registerCustomFunctions()
      console.log(greenHook, 'Custom SQL functions registered')
      const exportFunctionPromise = registerExportFunctions(exportApiIdentifier).then(() =>
        console.log(greenHook, 'Export functions registered'),
      )
      const generalizationFunctionPromise = registerGeneralizationFunctions(
        interactivityConfiguration,
      ).then(() => console.log(greenHook, 'Generalization functions registered'))
      runAnalysis()
      return Promise.all([exportFunctionPromise, generalizationFunctionPromise])
    } catch (e) {
      console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
    }
  }
}

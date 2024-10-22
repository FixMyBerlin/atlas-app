import chalk from 'chalk'
import { exportApiIdentifier } from './app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { interactivityConfiguration } from './app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/interacitvityConfiguartion'
import { aggregateLengths } from './instrumentation/aggregateLengths'
import { registerExportFunctions } from './instrumentation/registerExportFunctions'
import { registerGeneralizationFunctions } from './instrumentation/registerGeneralizationFunctions'
// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const greenHook = chalk.bold(chalk.green(' ✓'))
      const exportFunctionPromise = registerExportFunctions(exportApiIdentifier).then(() =>
        console.log(greenHook, 'Export functions registered'),
      )
      const generalizationFunctionPromise = registerGeneralizationFunctions(
        interactivityConfiguration,
      ).then(() => console.log(greenHook, 'Generalization functions registered'))
      console.log(chalk.bold(chalk.white(' ○')), `Running Analysis`)
      const startTime = Date.now()
      aggregateLengths().then(() => {
        const secondsElapsed = Math.round((Date.now() - startTime) / 100) / 10
        console.log(`${greenHook} Analysis completed ${secondsElapsed} s`)
      })
      return Promise.all([exportFunctionPromise, generalizationFunctionPromise])
    } catch (e) {
      console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
    }
  }
}

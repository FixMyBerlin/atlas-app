import { exportApiIdentifier } from './app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { interactivityConfiguration } from './app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/interacitvityConfiguartion'
import { registerCustomFunctions } from './instrumentation/registerCustomFunctions'
import { registerExportFunctions } from './instrumentation/registerExportFunctions'
import { registerGeneralizationFunctions } from './instrumentation/registerGeneralizationFunctions'

// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      await registerCustomFunctions()
      console.log(' ✓ Custom SQL functions registered')
      const exportFunctionPromise = registerExportFunctions(exportApiIdentifier).then(() =>
        console.log(' ✓ Export functions registered'),
      )
      const generalizationFunctionPromise = registerGeneralizationFunctions(
        interactivityConfiguration,
      ).then(() => console.log(' ✓ Generalization functions registered'))

      return Promise.all([exportFunctionPromise, generalizationFunctionPromise])
    } catch (e) {
      console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
    }
  }
}

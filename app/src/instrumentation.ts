import { exportApiIdentifier } from './app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { interactivityConfiguration } from './app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/interacitvityConfiguartion'
import { initCustomFunctions } from './instrumentation/initCustomFunctions'
import { initExportFunctions } from './instrumentation/initExportFunctions'
import { initGeneralizationFunctions } from './instrumentation/initGeneralizationFunctions'

// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      await initCustomFunctions()
      console.log(' ✓ Custom SQL functions initialized')
      const exportFunctionPromise = initExportFunctions(exportApiIdentifier).then(() =>
        console.log(' ✓ Export functions initialized'),
      )
      const generalizationFunctionPromise = initGeneralizationFunctions(
        interactivityConfiguration,
      ).then(() => console.log(' ✓ Generalization functions initialized'))

      return Promise.all([exportFunctionPromise, generalizationFunctionPromise])
    } catch (e) {
      console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
    }
  }
}

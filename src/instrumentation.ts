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
      await initExportFunctions(exportApiIdentifier)
      await initGeneralizationFunctions(interactivityConfiguration)
    } catch (e) {
      console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
    }
  }
}

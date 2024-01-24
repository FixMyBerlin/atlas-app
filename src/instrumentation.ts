import {
  exportApiIdentifier,
  verificationApiIdentifier,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { initExportFunctions } from './instrumentation/initExportFunctions'
import { initVerificationViews } from './instrumentation/initVerificationViews'

// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      await initVerificationViews(verificationApiIdentifier)
      await initExportFunctions(exportApiIdentifier)
    } catch (e) {
      console.error('\n\nINSTRUMENTATION HOOK FAILED', e)
    }
  }
}

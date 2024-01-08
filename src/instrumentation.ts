import {
  exportApiIdentifier,
  verificationApiIdentifier,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { initVerificationViews } from './instrumentation/initVerificationViews'
import { initExportFunctions } from './instrumentation/initExportFunctions'

// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  await initVerificationViews(verificationApiIdentifier)
  await initExportFunctions(exportApiIdentifier)
}

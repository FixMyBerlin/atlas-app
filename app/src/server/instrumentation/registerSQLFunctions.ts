import { exportApiIdentifier } from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { greenCheckmark } from './_utils/greenCheckmark'
import { registerExportFunctions } from './registerExportFunctions'
import { registerGeneralizationFunctions } from './registerGeneralizationFunctions'

export async function registerSQLFunctions() {
  try {
    const exportFunctionPromise = registerExportFunctions(exportApiIdentifier).then(() =>
      console.log(greenCheckmark, 'Export functions registered'),
    )
    const generalizationFunctionPromise = registerGeneralizationFunctions().then(() =>
      console.log(greenCheckmark, 'Generalization functions registered'),
    )

    await Promise.all([exportFunctionPromise, generalizationFunctionPromise])
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'INSTRUMENTATION HOOK FAILED', 'registerSQLFunctions', error)
  }
}

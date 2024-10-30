// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'parse-gitignore'
import slugify from 'slugify'
import { parseArgs } from 'util'
import { checkFilesizeAndGzip } from './updaetWfsSources/checkFilesizeAndGzip'
import { checkUpdatedAt } from './updaetWfsSources/checkUpdateAt'
import { createWfsUrl, WfsConfig } from './updaetWfsSources/createWfsUrl'
import { fetchAndStoreGeopackage } from './updaetWfsSources/fetchAndStoreGeopackage'
import { transformGeopackageToGeojson } from './updaetWfsSources/transformGeopackageToGeojson'
import { ignoreFolder } from './updateStaticDatasets/ignoreFolder'
import { import_ } from './utils/import_'
import { green, inverse, red } from './utils/log'

const geoJsonFolder = 'scripts/StaticDatasets/geojson'
export const tempFolder = 'scripts/StaticDatasets/_geojson_temp'
if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true })

// use --folder-filter to run only folders that include this filter string (check the full path, so `region-bb` (group folder) and `bb-` (dataset folder) will both work)
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    'keep-tmp': { type: 'boolean' },
    'folder-filter': { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

const keepTemporaryFiles = !!values['keep-tmp']
const folderFilterTerm = values['folder-filter']

inverse('Starting update with settings', [
  {
    folderFilterTerm,
    keepTemporaryFiles,
  },
])

const updateIgnorePath = path.join(geoJsonFolder, '.updateignore')
const ignorePatterns = fs.existsSync(updateIgnorePath)
  ? parse(fs.readFileSync(updateIgnorePath)).patterns
  : []

// Collect the file and folder data that we iterate over
const regionGroupFolderPaths = fs
  .readdirSync(geoJsonFolder)
  // Make sure we only select folders, no files
  .filter((item) => fs.statSync(path.join(geoJsonFolder, item)).isDirectory())

const datasetFileFolderData = regionGroupFolderPaths
  .map((regionGroupFolder) => {
    const subFolders = fs.readdirSync(path.join(geoJsonFolder, regionGroupFolder))
    return subFolders.map((datasetFolder) => {
      const targetFolder = path.join(geoJsonFolder, regionGroupFolder, datasetFolder)
      // If a `folder-filter` is given, we only look at folder that include this term
      if (folderFilterTerm && !targetFolder.includes(folderFilterTerm)) return
      // Make sure we only select folders, no files
      if (!fs.statSync(targetFolder).isDirectory()) return

      return { datasetFolderPath: targetFolder, regionFolder: regionGroupFolder, datasetFolder }
    })
  })
  .flat()
  .filter(Boolean)
  .sort((a, b) => a.datasetFolderPath.localeCompare(b.datasetFolderPath))

for (const { datasetFolderPath, regionFolder, datasetFolder } of datasetFileFolderData) {
  // Get the `wfsConfig.js` data ready
  const wfsConfig = await import_<WfsConfig>(datasetFolderPath, 'wfsConfig', 'wfsConfig')
  if (!wfsConfig) continue

  const dataFilename = slugify(wfsConfig.layer.replaceAll(':', '-'))

  const regionAndDatasetFolder = `${regionFolder}/${datasetFolder}`
  if (ignoreFolder(regionAndDatasetFolder, ignorePatterns)) {
    // console.log(`Ignoring folder "${regionAndDatasetFolder}"`)
    continue
  } else {
    inverse(`Processing folder "${regionAndDatasetFolder}"...`)
  }

  const wfsUrl = createWfsUrl(wfsConfig)
  console.log('  Downloading', wfsUrl.toString())
  try {
    const geoPackageFilename = path.join(tempFolder, `${dataFilename}.gpkg`)
    const geojsonFilename = path.join(datasetFolderPath, `${dataFilename}.wfs.geojson`)
    await fetchAndStoreGeopackage(wfsUrl, geoPackageFilename)
    await transformGeopackageToGeojson(geoPackageFilename, geojsonFilename)
    const resultFilename = await checkFilesizeAndGzip(geojsonFilename)

    green('  Data saved', resultFilename)
  } catch (error) {
    red('   Error', error, wfsConfig, wfsUrl.toString())
    continue
  }

  await checkUpdatedAt(wfsConfig.endpoint, datasetFolderPath)
}

inverse('DONE')

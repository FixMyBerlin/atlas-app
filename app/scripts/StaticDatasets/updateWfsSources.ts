// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'parse-gitignore'
import slugify from 'slugify'
import { parseArgs } from 'util'
import { checkUpdatedAt } from './updaetWfsSources/checkUpdateAt'
import { createWfsUrl, WfsConfig } from './updaetWfsSources/createWfsUrl'
import { fetchGeojsonFromWfs } from './updaetWfsSources/fetchGeojsonFromWfs'
import { ignoreFolder } from './updateStaticDatasets/ignoreFolder'
import { import_ } from './utils/import_'
import { green, inverse, red } from './utils/log'

const geoJsonFolder = 'scripts/StaticDatasets/geojson'

// use --folder-filter to run only folders that include this filter string (check the full path, so `region-bb` (group folder) and `bb-` (dataset folder) will both work)
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    'folder-filter': { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

const folderFilterTerm = values['folder-filter']

inverse('Starting update with settings', [
  {
    folderFilterTerm,
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

  const regionAndDatasetFolder = `${regionFolder}/${datasetFolder}`
  if (ignoreFolder(regionAndDatasetFolder, ignorePatterns) || wfsConfig === null) {
    // console.log(`Ignoring folder "${regionAndDatasetFolder}"`)
    continue
  } else {
    inverse(`Processing folder "${regionAndDatasetFolder}"...`)
  }

  const wfsUrl = createWfsUrl(wfsConfig)
  console.log('  Downloading', wfsUrl.toString())
  try {
    const data = await fetchGeojsonFromWfs(wfsUrl)
    const outputFullFilename = path.join(
      datasetFolderPath,
      `${slugify(wfsConfig.layer.replaceAll(':', '-'))}.downloaded.geojson`,
    )
    await Bun.write(outputFullFilename, JSON.stringify(data, null, 2))

    green('  Data saved', data.features.length, 'features', outputFullFilename)
  } catch (error) {
    red('   Error', error, wfsConfig, wfsUrl.toString())
    continue
  }

  await checkUpdatedAt(wfsConfig.endpoint, datasetFolderPath)
}

inverse('DONE')

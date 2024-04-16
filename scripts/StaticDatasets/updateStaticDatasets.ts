// We use bun.sh to run this file
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import pluralize from 'pluralize'
import slugify from 'slugify'
import { parseArgs } from 'util'
import { createUpload, getRegions } from './api'
import { MetaData } from './types'
import { findGeojson } from './updateStaticDatasets/findGeojson'
import { generatePMTilesFile } from './updateStaticDatasets/generatePMTilesFile'
import { transformFile } from './updateStaticDatasets/transformFile'
import { uploadFileToS3 } from './updateStaticDatasets/uploadFileToS3'
import { green, inverse, red, yellow } from './utils/log'

const geoJsonFolder = 'scripts/StaticDatasets/geojson'
export const tmpDir = path.join(os.tmpdir(), 'pmtiles')
const regions = await getRegions()
const existingRegionSlugs = regions.map((region) => region.slug)

// use --dry-run to run all checks and transformation (but no pmtiles created, no upload to S3, no DB modifications)
// use --keep-tmp to keep temporary generated files
// use --keep-tmp to keep temporary generated files
// use --folder-filter to run only folders that include this filter string (check the full path, so `region-bb` (group folder) and `bb-` (dataset folder) will both work)
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    'dry-run': { type: 'boolean' },
    'keep-tmp': { type: 'boolean' },
    'folder-filter': { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

const dryRun = !!values['dry-run']
const keepTemporaryFiles = !!values['keep-tmp']
const folderFilterTerm = values['folder-filter']

inverse('Starting update with settings', [
  {
    API_ROOT_URL: process.env.API_ROOT_URL,
    S3_UPLOAD_FOLDER: process.env.S3_UPLOAD_FOLDER,
    ...(keepTemporaryFiles ? { tmpDir } : {}),
    ...(folderFilterTerm ? { folderFilterTerm } : {}),
  },
])

/** @returns Object or Function | null */
export const import_ = async <ReturnModule extends Function | Object>(
  folderName: string,
  moduleName: string,
  valueName: string,
) => {
  const moduleFileName = `${moduleName}.ts`
  const moduleFullFilename = path.join(folderName, moduleFileName)

  if (!fs.existsSync(moduleFullFilename)) {
    return null
  }

  const module_ = await import(moduleFullFilename)

  if (!(valueName in module_)) {
    yellow(`  ${moduleFileName} does not export value "${valueName}".`)
    return null
  }
  return module_[valueName] as ReturnModule
}

// create tmp folder
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

if (!fs.existsSync(geoJsonFolder)) {
  red(`folder "${geoJsonFolder}" does not exists. Please run "npm run link-atlas-static-data"?`)
  process.exit(1)
}

// Collect the file and folder data that we iterate over
const regionGroupFolderPaths = fs
  .readdirSync(geoJsonFolder)
  // Make sure we only select folders, no files
  .filter((item) => fs.statSync(path.join(geoJsonFolder, item)).isDirectory())
  // We skip `_utils` and by convention prefix unpublished datasets with underscore
  .filter((folder) => !folder.startsWith('_'))
const datasetFileFolderData = regionGroupFolderPaths
  .map((regionGroupFolder) => {
    const subFolders = fs.readdirSync(path.join(geoJsonFolder, regionGroupFolder))
    return subFolders.map((datasetFolder) => {
      const targetFolder = path.join(geoJsonFolder, regionGroupFolder, datasetFolder)
      // We skip `_utils` and by convention prefix unpublished datasets with underscore
      if (datasetFolder.startsWith('_')) return
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
  const regionAndDatasetFolder = `${regionFolder}/${datasetFolder}`
  inverse(`Processing folder "${regionAndDatasetFolder}"...`)

  // Guard invalid folder names (characters)
  const uploadSlug = slugify(datasetFolder.replaceAll('_', '-'))
  if (datasetFolder !== uploadSlug) {
    yellow(
      `  Folder name "${datasetFolder}" in ${regionAndDatasetFolder} is not a valid slug.
      \n  A valid slug would be "${uploadSlug}"`,
    )
    continue
  }

  // Get the `meta.js` data ready
  const metaData = await import_<MetaData>(datasetFolderPath, 'meta', 'data')
  if (metaData === null) {
    yellow(`  File 'meta.ts' is missing in folder ${datasetFolderPath}`)
    continue
  }

  // Get the one `.geojson` file that we will handle ready
  const geojsonFullFilename = findGeojson(datasetFolderPath)
  if (!geojsonFullFilename) {
    // Logging is part of findGeojson()
    continue
  }

  // Create the transformed data (or duplicate existing geojson)
  const inputFullFilepath = await transformFile(datasetFolderPath, geojsonFullFilename, tmpDir)

  // Create the pmtiles
  const outputFullFilepath = dryRun
    ? '/tmp/does-not-exist.pmtiles'
    : await generatePMTilesFile(inputFullFilepath, tmpDir)
  if (dryRun) console.log(`  DRY RUN: SKIPPING Generating pmtiles file...`)

  // Upload pmtiles to S3
  const pmtilesUrl = dryRun
    ? 'http://example.com/does-not-exist.pmtiles'
    : await uploadFileToS3(outputFullFilepath, datasetFolder)
  if (dryRun) console.log(`  DRY RUN: SKIPPING Uploading generated pmtiles file to S3...`)

  // Create database entries dataset per region (from meta.ts)
  const regionSlugs: string[] = []
  metaData.regions.forEach((regionSlug) => {
    if (existingRegionSlugs.includes(regionSlug)) {
      regionSlugs.push(regionSlug)
    } else {
      yellow(`  region "${regionSlug}" (defined in meta.regions) does not exist.`)
    }
  })

  const info =
    regionSlugs.length === 0
      ? 'will not be assigned to any region'
      : `will be assigned to ${pluralize('region', regionSlugs.length)} ${regionSlugs.join(', ')}`
  if (dryRun) console.log(`  DRY RUN: SKIPPING Saving upload to DB (${info})...`)
  if (!dryRun) {
    console.log(`  Saving upload to DB (${info})...`)
    const mergedConfigs = metaData.configs.map((config) => {
      return {
        githubUrl: `https://github.com/FixMyBerlin/atlas-static-data/tree/main/geojson/${regionAndDatasetFolder}`,
        ...config,
      }
    })
    await createUpload({
      uploadSlug,
      pmtilesUrl,
      regionSlugs,
      isPublic: metaData.public,
      configs: mergedConfigs,
    })
  }

  green('  OK')
}

// List processed temp geojson files when --keep-tmp present for easy access to check the file
if (keepTemporaryFiles) {
  inverse('Processed temporary files')
  const tempGeojsonFiles = fs
    .readdirSync(tmpDir)
    .filter((file) => file.endsWith('.geojson'))
    .filter((file) => (folderFilterTerm ? file.includes(folderFilterTerm) : true))
    .sort()
  tempGeojsonFiles.map((file) => {
    console.log(`  ${path.join(tmpDir, file)}`)
  })
}

// Clean up
if (!keepTemporaryFiles) {
  fs.rmSync(tmpDir, { recursive: true, force: true })
}

inverse('DONE')

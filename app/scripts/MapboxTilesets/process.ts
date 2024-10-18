// We use bun.sh to run this file
import chalk from 'chalk'
import { getExportApiBboxUrl } from '@/src/app/_components/utils/getExportApiUrl'
import { StaticRegion } from '@/src/app/regionen/(index)/_data/regions.const'
import { SourceExportApiIdentifier } from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { tilesetConfigs } from './datasets'

console.log(chalk.inverse.bold('START'), __filename)

// Folder
const folderJson = 'scripts/MapboxTilesets/json'
const folderMbtiles = 'scripts/MapboxTilesets/mbtiles'

console.log(
  chalk.inverse.bold('INFO'),
  'Opening mbtiles folder so you may "replace" the Mapbox tilesets in the browser.',
)
Bun.spawnSync(['open', folderMbtiles])

// Fetch, Write, Transform
for (const dataset of Object.entries(tilesetConfigs)) {
  const datasetKey = dataset[0] as SourceExportApiIdentifier
  const { sourceLayer, uploadUrl, bbox } = dataset[1]

  // Fetch Export API
  const apiKey = process.env.ATLAS_API_KEY
  // The `apiKey` with skip the region check (hence the `noRegion`)
  const url = getExportApiBboxUrl('noRegion', datasetKey, bbox, 'staging', apiKey)
  console.log('\n', chalk.inverse.bold(chalk.yellow('FETCH')), url)
  const fetchExport = await fetch(url)

  if (!fetchExport.ok) {
    console.error('Fetch failed', fetchExport)
    process.exit()
  }
  const rawData: any = await fetchExport.json()

  // For debugging: Write JSON Response
  const jsonFile = `${folderJson}/atlas_${datasetKey}.geojson`
  console.log(chalk.inverse.bold('WRITE'), jsonFile)
  await Bun.write(jsonFile, JSON.stringify(rawData, undefined, 2))

  // Create mbTiles with Tippecanoe
  const mbtilesFile = `${folderMbtiles}/atlas_${datasetKey}.mbtiles`
  console.log(chalk.inverse.bold('RUN'), 'tippecanoe', mbtilesFile)
  Bun.spawnSync(
    [
      'tippecanoe',
      `--output=${mbtilesFile}`,
      '--force',
      '--maximum-zoom=g', // Automatically choose a maxzoom that should be sufficient to clearly distinguish the features and the detail within each feature https://github.com/felt/tippecanoe#zoom-levels
      '-rg', // If you use -rg, it will guess a drop rate that will keep at most 50,000 features in the densest tile https://github.com/felt/tippecanoe#dropping-a-fixed-fraction-of-features-by-zoom-level
      '--drop-densest-as-needed', // https://github.com/felt/tippecanoe?tab=readme-ov-file#dropping-a-fraction-of-features-to-keep-under-tile-size-limits
      '--extend-zooms-if-still-dropping', // https://github.com/felt/tippecanoe?tab=readme-ov-file#zoom-levels
      `--layer=${sourceLayer}`, // We need to specify a specifiy layer name which was initially used by Mapbox when we uploaded the geojson files, otherwise the stiles need to be updated…
      jsonFile,
    ],
    {
      onExit(_proc, exitCode, _signalCode, error) {
        exitCode && console.log('exitCode:', exitCode)
        error && console.log('error:', error)
      },
    },
  )

  // Open URL to upload
  if (uploadUrl) {
    console.log(chalk.inverse.bold('NOW…'), 'upload', mbtilesFile, 'on', uploadUrl)
    Bun.spawnSync(['open', uploadUrl])
  } else {
    console.log(
      chalk.inverse.bold('NOW…'),
      'upload',
      mbtilesFile,
      'to',
      `https://studio.mapbox.com/tilesets/?q=${datasetKey}`,
      '(and then add the upload URL to the processing file…)',
    )
  }
}

console.log('\n', chalk.inverse.bold('DONE'))

// We use bun.sh to run this file
import chalk from 'chalk'
import { getExportApiBboxUrl } from 'src/app/_components/utils/getExportApiUrl'
import { StaticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { SourceExportApiIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'

console.log(chalk.inverse.bold('START'), __filename)

// Configruation:
// BBox: Brandenburg
const bboxBrandenburg = {
  min: [11.2662278, 51.359064],
  max: [14.7658159, 53.5590907],
} satisfies StaticRegion['bbox']
// BBox: A bit of Berlin and rual areas below (NUDAFA)
const bboxBerlinPlus = {
  min: [13.2809, 52.2095],
  max: [13.825, 52.5528],
} satisfies StaticRegion['bbox']
// Datasets:
const datasets: Record<
  SourceExportApiIdentifier,
  { sourceLayer: string; uploadUrl: string; bbox: NonNullable<StaticRegion['bbox']> }
> = {
  bicycleParking_points: {
    sourceLayer: 'bicycleParking_points',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.c65ckqta/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  bicycleParking_areas: {
    sourceLayer: 'bicycleParking_areas',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.0p8hdib5/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  bikelanes_verified: {
    sourceLayer: 'bikelanes_verified',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.3i25sspf/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  places: {
    sourceLayer: 'tarmac-places-test-datensatz-5dodjb',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.34e901wi/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  poiClassification: {
    sourceLayer: 'poiClassification',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.0wsdyx91/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  publicTransport: {
    sourceLayer: 'publicTransport',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.7fmhzgpi/#14/52.51622/13.39233',
    bbox: bboxBrandenburg,
  },
  trafficSigns: {
    sourceLayer: 'atlas-trafficSigns-attp60',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.8trg6z1b/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  landuse: {
    sourceLayer: 'tarmac-landuse-test-datensatz-0r36t3',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.8xhph4k4/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  barrierAreas: {
    sourceLayer: 'atlas-barrierAreas-b9mb1o',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.3m06nhmv/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  barrierLines: {
    sourceLayer: 'atlas-barrierLines-3ft1bu',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.cx602vbw/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  boundaries: {
    sourceLayer: 'atlas-boundaries-66z5h4',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.4u44tl11/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  boundaryLabels: {
    sourceLayer: 'atlas_boundariesLabel-1q1c4n',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.cuem4dsu/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  roads: {
    sourceLayer: 'roads',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.0f7p6nhx/#14/52.51622/13.37036',
    bbox: bboxBerlinPlus,
  },
}

// Folder
const folderJson = 'scripts/MapboxTilesets/json'
const folderMbtiles = 'scripts/MapboxTilesets/mbtiles'

console.log(
  chalk.inverse.bold('INFO'),
  'Opening mbtiles folder so you may "replace" the Mapbox tilesets in the browser.',
)
Bun.spawnSync(['open', folderMbtiles])

// Fetch, Write, Transform
for (const dataset of Object.entries(datasets)) {
  const datasetKey = dataset[0] as SourceExportApiIdentifier
  const { sourceLayer, uploadUrl, bbox } = dataset[1]

  // Fetch Export API
  const accessToken = process.env.EXPORT_ACCESS_TOKEN
  // The `accessToken` with skip the region check (hence the `noRegion`)
  const url = getExportApiBboxUrl('noRegion', datasetKey, bbox, 'staging', accessToken)
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

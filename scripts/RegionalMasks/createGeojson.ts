// We use bun.sh to run this file
import {
  bbox,
  buffer,
  centerOfMass,
  difference,
  feature,
  featureCollection,
  point,
  polygon,
  simplify,
} from '@turf/turf'
import chalk from 'chalk'
import path from 'node:path'
import { z } from 'zod'
import { additionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'
import { exportApiBaseUrl } from 'src/app/_components/utils/getExportApiUrl'

console.log(chalk.inverse.bold('START'), __filename)

const geojsonPolygon = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
})
const geojsonMultipolyon = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
})
const geojsonInputSchema = z.union([geojsonPolygon, geojsonMultipolyon])
const geoJsonResultSchema = z.object({
  type: z.literal('Feature'),
  geometry: geojsonMultipolyon.or(geojsonPolygon),
  properties: z.object({
    kind: z.enum(['boundary', 'buffer']),
    ids: z.string(),
    region: z.string(),
  }),
})

const errorLog: any[] = []

const handleError = (error: (string | Record<string, string | number>)[]) => {
  errorLog.push(Date.now().toString(), error)
  console.error(chalk.bgYellow.black(...error))
}

const saveErrors = async () => {
  const fileName = 'error.log'
  const filePath = path.resolve(__dirname, fileName)
  await Bun.write(filePath, JSON.stringify(errorLog, undefined, 2))
}

const downloadGeoJson = async (idsString: string) => {
  // We always use the production DB since that holds all relevant releations
  // TODO: Change this to production once the api is deployed there
  const url = new URL(`${exportApiBaseUrl.staging}/boundaries/`)
  idsString
    .split(',')
    .map(Number)
    .filter(Boolean)
    .forEach((id) => {
      url.searchParams.append('ids', String(id))
    })

  console.info(chalk.inverse.bold('DOWNLOAD'), url.href)
  const response = await fetch(url.href)

  try {
    const data = await response.json()
    const geoJson = geojsonInputSchema.parse(data)
    return geoJson
  } catch (error) {
    handleError([
      'ERROR: Download failed for',
      url.href,
      {
        statusCode: response.status,
        statusText: response.statusText,
        response: JSON.stringify(response),
      },
    ])
  }
}

const createBoundaryFeature = (geojson, ids: string, region: string) => {
  const boundaryPoly = simplify(geojson, { tolerance: 0.0001, highQuality: false })

  const result = geoJsonResultSchema.parse(feature(boundaryPoly, { kind: 'boundary', ids, region }))
  return result
}

const createBufferFeature = (boundaryPoly, ids: string, region: string) => {
  const { geometry: bufferedPoly } = buffer(boundaryPoly, 10, { units: 'kilometers' })
  const result = geoJsonResultSchema.parse(feature(bufferedPoly, { kind: 'buffer', ids, region }))
  return result
}

const createMaskFeature = (featureToCutOut: ReturnType<typeof createBufferFeature>) => {
  const germanyBbox = [5.98865807458, 47.3024876979, 15.0169958839, 54.983104153] as const
  const germanyBboxPolygon = polygon(
    [
      [
        [germanyBbox[0], germanyBbox[1]],
        [germanyBbox[0], germanyBbox[3]],
        [germanyBbox[2], germanyBbox[3]],
        [germanyBbox[2], germanyBbox[1]],
        [germanyBbox[0], germanyBbox[1]],
      ],
    ],
    featureToCutOut.properties, // those will be added to the returning feature
  )

  const mask = difference(germanyBboxPolygon, featureToCutOut)
  const result = geoJsonResultSchema.parse(mask)
  return result
}

// 1. Collect the boundary and mask per region
const collectedFeatures: ReturnType<typeof createBufferFeature>[] = []
for (const region of additionalRegionAttributes) {
  const { slug: regionName, osmRelationIds } = region
  if (!osmRelationIds.length) continue
  console.info(chalk.inverse.bold('INFO: Now working on region', regionName))

  const geojson = await downloadGeoJson(osmRelationIds.map(String).join(','))
  if (geojson) {
    const ids = osmRelationIds.join(',')

    const boundaryFeature = createBoundaryFeature(geojson, ids, regionName)
    const bufferFeature = createBufferFeature(boundaryFeature, ids, regionName)
    const mask = createMaskFeature(bufferFeature)

    collectedFeatures.push(boundaryFeature)
    collectedFeatures.push(mask)

    // Store separate files for debugging
    await Bun.write(
      path.resolve(__dirname, `./geojson/${regionName}-regional-mask-for-debugging.geojson`),
      JSON.stringify(boundaryFeature),
    )
    // And also store the bbox and centerOfMass for use in regions.const.ts
    await Bun.write(
      path.resolve(__dirname, `./geojson/${regionName}-bbox-center-for-reference.geojson`),
      JSON.stringify(
        point(centerOfMass(boundaryFeature).geometry.coordinates, {
          bbox: bbox(boundaryFeature),
        }),
      ),
    )
  }
}

// 2. Save them locally to be picked up by createMbtiles
const collectedFeatureCollection = featureCollection(collectedFeatures)
const boundariesAndMaskGeojson = path.resolve(__dirname, './geojson/atlas-regional-masks.geojson')
await Bun.write(boundariesAndMaskGeojson, JSON.stringify(collectedFeatureCollection))

await saveErrors()
console.info(chalk.inverse.bold('FINISHED createGeojson'))

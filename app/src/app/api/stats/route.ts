import { isProd } from '@/src/app/_components/utils/isEnv'
import { geoDataClient } from '@/src/prisma-client'
import { feature, featureCollection, simplify, transformScale, truncate } from '@turf/turf'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { compareFeatures } from '../../regionen/[regionSlug]/_components/SidebarInspector/util'

const position = z.tuple([z.number(), z.number()])
const linearRing = z.array(position)
const polygon = z.array(linearRing)
const multiPolygon = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(polygon),
})
const StatSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['4', '6']),
  road_length: z.record(z.string(), z.number()),
  bikelane_length: z.record(z.string(), z.number()).optional(),
  geojson: multiPolygon,
})
const StatsSchema = z.array(StatSchema)

export async function GET() {
  try {
    type TDate = { osm_data_from: string }[]
    const rawDate = await geoDataClient.$queryRaw<TDate>`
      SELECT osm_data_from
      FROM public.meta
      ORDER BY id DESC
      LIMIT 1
    `

    const raw = await geoDataClient.$queryRaw`
      SELECT
        id,
        name,
        level,
        road_length,
        bikelane_length,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb AS geojson
      FROM public.aggregated_lengths;`

    const parsed = StatsSchema.parse(raw)

    const features = parsed.map(({ geojson, ...stat }) => {
      // PROPERTIES: Add children
      // Docs https://turfjs.org/docs/api/transformScale
      const geomParentLarger = transformScale(geojson, 1.1)
      const children =
        // Only level 4 can have children
        stat.level === '4'
          ? parsed
              // Children can only be level 6
              .filter(({ level }) => level === '6')
              .map(({ geojson: geomChildCandidate, id, name }) => {
                // Note: We cannot use https://turfjs.org/docs/api/booleanWithin
                const compareToken = compareFeatures(
                  { geometry: geomChildCandidate },
                  { geometry: geomParentLarger },
                )
                if (compareToken === '>') {
                  return { id, name }
                }
              })
              .filter(Boolean)
          : undefined
      const properties = { ...stat, children }

      // GEOMETRY: Cleanup
      // Docs https://turfjs.org/docs/api/simplify
      const geomSimplified = simplify(geojson, { tolerance: 0.05, highQuality: true })
      // Docs https://turfjs.org/docs/api/truncate
      const geomTruncated = truncate(geomSimplified, { precision: 6, coordinates: 2 })

      return feature(geomTruncated, properties, { id: stat.id })
    })

    const collection = featureCollection(features)
    // @ts-expect-error We breakt he feature collection convention here
    collection.updatedAt = rawDate.at(0)?.osm_data_from
    return NextResponse.json(collection)
  } catch (error) {
    console.error(error) // Log files
    return Response.json(
      {
        error: 'Internal Server Error',
        info: isProd ? undefined : error,
      },
      { status: 500 },
    )
  }
}

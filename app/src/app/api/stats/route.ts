import { isProd } from '@/src/app/_components/utils/isEnv'
import { geoDataClient } from '@/src/prisma-client'
import { feature, featureCollection, simplify, truncate } from '@turf/turf'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const position = z.tuple([z.number(), z.number()])
const linearRing = z.array(position)
const polygon = z.array(linearRing)
const multiPolygon = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(polygon),
})
const DbStatSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['4', '6']),
  road_length: z.record(z.string(), z.number()),
  bikelane_length: z.record(z.string(), z.number()).nullable(),
  geojson: multiPolygon,
})
const DbStatsSchema = z.array(DbStatSchema)

export async function GET() {
  try {
    const raw = await geoDataClient.$queryRaw`
      SELECT
        id,
        name,
        level,
        road_length,
        bikelane_length,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb AS geojson
      FROM public.aggregated_lengths;`

    const parsed = DbStatsSchema.parse(raw)

    const features = parsed.map(({ geojson, ...properties }) => {
      // GEOMETRY: Cleanup
      // Docs https://turfjs.org/docs/api/simplify
      const geomSimplified = simplify(geojson, { tolerance: 0.05 })
      // Docs https://turfjs.org/docs/api/truncate
      const geomTruncated = truncate(geomSimplified, { precision: 6, coordinates: 2 })

      return feature(geomTruncated, properties, { id: properties.id })
    })

    return NextResponse.json(featureCollection(features))
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

import { isProd } from '@/src/app/_components/utils/isEnv'
import { osmTypeIdString } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { geoDataClient } from '@/src/prisma-client'
import { todoIds } from '@/src/processingTypes/todoIds.const'
import { feature } from '@turf/turf'
import { LineString } from 'geojson'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import pako from 'pako'
import { z } from 'zod'
import { maprouletteTaskDescriptionMarkdown } from './_utils/taskMarkdown'

const MaprouletteSchema = z
  .object({
    projectKey: z.enum(todoIds),
    download: z
      .string()
      .transform((val) => val === 'true')
      .nullish(),
  })
  .strict()

// For testing:
// Germany http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244
// Germany http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?download=true
export async function GET(request: NextRequest, { params }: { params: { projectKey: string } }) {
  const rawSearchParams = request.nextUrl.searchParams
  const parsedParams = MaprouletteSchema.safeParse({
    projectKey: params.projectKey,
    download: rawSearchParams.get('download'),
  })

  // VALIDATE PARAMS
  if (parsedParams.success === false) {
    return NextResponse.json({ error: 'Invalid input', ...parsedParams.error }, { status: 404 })
  }
  const { projectKey, download } = parsedParams.data

  try {
    // SELECT DATA FROM `bikelanes` or `roads`
    type QueryType = {
      osm_type: string
      osm_id: string
      id: string
      priority: string
      kind: string
      geometry: LineString
    }[]

    // NOTE: `todos_lines.tags->>${projectKey}` will automatically be wrapped like `todos_lines.tags->>'foo'`
    // Docs:
    // `ST_Transform` changes projection
    // `ST_SimplifyPreserveTopology` simplifies the geometry (number of nodes) https://postgis.net/docs/ST_SimplifyPreserveTopology.html
    // `ST_AsGeoJSON` with `6` will reduce the number of digits for the lat/lng values https://postgis.net/docs/ST_AsGeoJSON.html
    //
    // NOTE `LIMIT`: MapRoulette allows 50k tasks per challenge.
    //   Source https://github.com/search?q=repo%3Amaproulette%2Fmaproulette-backend%20DEFAULT_MAX_TASKS_PER_CHALLENGE&type=code
    //   The working theory is, that the 50k limit will include completed tasks. See https://osmus.slack.com/archives/C1QN12RS7/p1739360075037439
    //   Which is why we go for 40k and after 10k have been completed, we will have to create a new challenge…
    const sqlWays = await geoDataClient.$queryRaw<QueryType>`
      SELECT
        todos_lines.osm_type as osm_type,
        todos_lines.osm_id as osm_id,
        todos_lines.id as id,
        todos_lines.tags->>${projectKey} as priority,
        todos_lines.meta->'category' AS kind,
        ST_AsGeoJSON(
          ST_SimplifyPreserveTopology(
            ST_Transform(todos_lines.geom, 4326),
            0.75
          ),
          6
        )::jsonb AS geometry
      FROM public.todos_lines as todos_lines
      WHERE todos_lines.tags ? ${projectKey}
      ORDER BY todos_lines.length DESC
      LIMIT 40000;
    `

    // We need to stream the response and cache it as file.
    // If we don't, the app will return a very unhelpful error `RangeError: Invalid string length`
    // which suggest that the server ran out of memory.
    const outputFilePath = path.resolve(
      'public',
      'temp',
      `api-maproulette-${projectKey}-temp-${Date.now()}.geojson`,
    )
    const fileStream = fs.createWriteStream(outputFilePath)

    // ADD MAPROULETTE TASK DATA
    console.log('INFO', 'api/maproulette/[projectKey]/route.ts:', {
      resultSize: sqlWays.length,
      projectKey,
    })
    for (const sqlWay of sqlWays) {
      const { osm_type, osm_id, id, priority, kind, geometry } = sqlWay
      const osmTypeId = osmTypeIdString(osm_type, osm_id)

      let text: undefined | string = undefined
      try {
        text = maprouletteTaskDescriptionMarkdown({
          projectKey,
          osmTypeIdString: osmTypeId,
          kind,
          geometry,
        })
      } catch (error) {
        console.log(
          'ERROR',
          'api/maproulette/[projectKey]/route.ts',
          'in maprouletteTaskDescriptionMarkdown',
          error,
          { osm_type, osm_id, id, priority, kind, geometry },
        )
      }
      const properties = {
        // id: osmTypeId, // feature.properties.id is the OSM ID "way/123"
        priority,
        task_updated_at: new Date().toISOString(), // can be used in MapRoulette to see if/when data was fetched
        task_markdown: (text || 'TASK DESCRIPTION MISSING').replaceAll('\n', ' \n'),
      }

      // feature.id is the unique ID for MapRoulette "way/40232717/cycleway/right"
      const geojsonFeature = feature(geometry, properties, { id })
      const rsChar = String.fromCharCode(0x1e) // See https://learn.maproulette.org/en-us/documentation/line-by-line-geojson/
      fileStream.write(`${rsChar}${JSON.stringify(geojsonFeature)}\n`)
    }

    // RESPONSE
    // We return Newline-delimited GeoJSON (also known as "line-oriented GeoJSON", "GeoJSONL", "GeoJSONSeq" or "GeoJSON Text Sequences")
    // because that is easier to do an MapRoulette can handle it just as well.
    fileStream.end()
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve)
      fileStream.on('error', reject)
    })
    // Re-read the file to return it; then delete it right away
    const fileBuffer = await fs.promises.readFile(outputFilePath)
    await fs.promises.unlink(outputFilePath) // delete file

    const filename = `maproulette-${projectKey}-newline-delimited-geojson.json`
    const optionalDownloadHeader =
      download === true
        ? { 'Content-Disposition': `attachment; filename="${filename}"` }
        : undefined

    if (request.headers.get('accept-encoding')?.includes('gzip')) {
      const compressed = new Uint8Array(pako.gzip(fileBuffer))
      return new Response(compressed, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
          'Content-Length': compressed.length.toString(),
          ...optionalDownloadHeader,
        },
      })
    }
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': fileBuffer.length.toString(),
        ...optionalDownloadHeader,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Internal Server Error', info: isProd ? undefined : error },
      { status: 500 },
    )
  }
}

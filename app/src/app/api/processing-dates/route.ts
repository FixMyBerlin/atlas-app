import { isProd } from '@/src/app/_components/utils/isEnv'
import { geoDataClient } from '@/src/prisma-client'
import { ProcessingDates } from '@/src/regions/schemas'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    type Query = { processed_at: string; osm_data_from: string }[]
    const result = await geoDataClient.$queryRaw<Query>`
      SELECT processed_at, osm_data_from
      FROM public.meta
      ORDER BY id DESC
      LIMIT 1
    `

    const parsed = ProcessingDates.parse(result[0])

    return NextResponse.json(parsed)
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

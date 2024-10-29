import { isProd } from '@/src/app/_components/utils/isEnv'
import { geoDataClient } from '@/src/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stats = await geoDataClient.$queryRaw`
      SELECT name, level, road_length, bikelane_length from public.aggregated_lengths;`
    return NextResponse.json(stats)
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

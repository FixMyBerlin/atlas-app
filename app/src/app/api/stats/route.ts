import { geoDataClient } from '@/src/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stats = await geoDataClient.$queryRaw`
      SELECT name, level, road_length, bikelane_length from public.aggregated_lengths;`
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

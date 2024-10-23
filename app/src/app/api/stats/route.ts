import { geoDataClient } from '@/src/prisma-client'
import { getAllStatistics } from '@prisma/client/sql'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stats = await geoDataClient.$queryRawTyped(getAllStatistics())
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

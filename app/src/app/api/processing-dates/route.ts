import { isProd } from '@/src/app/_components/utils/isEnv'
import { geoDataClient } from '@/src/prisma-client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const DatesSchema = z.object({
  processed_at: z.date(),
  osm_data_from: z.date(),
})

export async function GET() {
  try {
    const result = await geoDataClient.$queryRaw`
      SELECT processed_at, osm_data_from
      FROM public.meta
      ORDER BY id DESC
      LIMIT 1
    `

    const parsed = DatesSchema.parse(
      // @ts-expect-error
      result[0],
    )

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

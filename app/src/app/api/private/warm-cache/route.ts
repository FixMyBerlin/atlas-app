import chalk from 'chalk'
import { NextRequest, NextResponse } from 'next/server'
import { staticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { z } from 'zod'
import { warmCache } from './warmCache'

const Schema = z.object({
  apiKey: z.string(),
})

export async function GET(req: NextRequest) {
  // Parse and validate the query string
  const requestUrl = new URL(req.url)
  const params = Schema.safeParse(Object.fromEntries(requestUrl.searchParams.entries()))
  if (params.success == false) {
    console.error("Couldn't parse query string", params.error)
    return NextResponse.json({ error: 'Invalid input', ...params.error }, { status: 400 })
  }
  // Check the API key
  try {
    if (params.data.apiKey !== process.env.ATLAS_API_KEY) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    for (const region of staticRegion) {
      if (region.cacheWarming != undefined && region.bbox != null) {
        const { minZoom, maxZoom, tables } = region.cacheWarming
        console.log(chalk.grey(' ○'), `Warming cache for ${region.slug} (${minZoom}-${maxZoom})`)
        warmCache(region.bbox, minZoom, maxZoom, tables)
        console.log(chalk.bold(chalk.green(' ✓')), `Warmed cache for ${region.slug}`)
      }
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

import chalk from 'chalk'
import { NextRequest, NextResponse } from 'next/server'
import { isProd } from 'src/app/_components/utils/isEnv'
import { staticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { z } from 'zod'
import { warmCache } from './warmCache'

const WarmCacheSchema = z.object({
  apiKey: z.string(),
})

export async function GET(req: NextRequest) {
  // Parse and validate the query string
  let params
  try {
    const url = new URL(req.url)
    params = WarmCacheSchema.parse(Object.fromEntries(url.searchParams.entries()))
  } catch (e) {
    if (!isProd) throw e
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
  }

  // Check the API key
  try {
    if (params.apiKey !== process.env.ATLAS_API_KEY) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    for (const region of staticRegion) {
      if (region.cacheWarming != undefined && region.bbox != null) {
        const { minZoom, maxZoom, tables } = region.cacheWarming
        console.log(chalk.grey(' ○'), `Warming cache for ${region.slug} (${minZoom}-${maxZoom})`)
        warmCache(region.bbox, minZoom, maxZoom, tables).then(() =>
          console.log(chalk.bold(chalk.green(' ✓')), `Warmed cache for ${region.slug}`),
        )
      }
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

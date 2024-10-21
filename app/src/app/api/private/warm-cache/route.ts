import chalk from 'chalk'
import { NextRequest, NextResponse } from 'next/server'
import { staticRegion, StaticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { z } from 'zod'
import { guardEnpoint } from '../guardEndpoint'
import { warmCache } from './warmCache'

const Schema = z.object({
  apiKey: z.string(),
})

export async function warmRegions(staticRegion: StaticRegion[]) {
  for (const region of staticRegion) {
    if (region.cacheWarming != undefined && region.bbox != null) {
      const { minZoom, maxZoom, tables } = region.cacheWarming
      console.log(
        chalk.bold(chalk.white(' ○')),
        `Warming cache for ${region.slug} (${minZoom}-${maxZoom})`,
      )
      await warmCache(region.bbox, minZoom, maxZoom, tables)
      console.log(chalk.bold(chalk.green(' ✓')), `Warmed cache for ${region.slug}`)
    }
  }
}

export async function GET(req: NextRequest) {
  const { access, response } = guardEnpoint(req, Schema)
  if (!access) return response
  try {
    warmRegions(staticRegion)
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

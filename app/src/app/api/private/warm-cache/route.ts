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
  const greenCheckmark = chalk.bold(chalk.green(' ✓'))
  const whiteCircle = chalk.bold(chalk.white(' ○'))
  for (const region of staticRegion) {
    if (region.cacheWarming != undefined && region.bbox != null) {
      const { minZoom, maxZoom, tables } = region.cacheWarming
      console.log(whiteCircle, `Warming cache for ${region.slug} (${minZoom}-${maxZoom})`)
      const startTime = Date.now()
      await warmCache(region.bbox, minZoom, maxZoom, tables)
      const secondsElapsed = Math.round((Date.now() - startTime) / 100) / 10
      console.log(greenCheckmark, `Warmed cache for ${region.slug} in ${secondsElapsed} s`)
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

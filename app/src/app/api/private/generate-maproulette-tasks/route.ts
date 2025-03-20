import { maprouletteRebuildTasks } from '@/scripts/MaprouletteRebuild/utils/maprouletteRebuildTasks'
import { isProd } from '@/src/app/_components/utils/isEnv'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { guardEnpoint } from '../_utils/guardEndpoint'

const Schema = z.object({
  apiKey: z.string(),
})

// To run it locally, use http://127.0.0.1:5173/api/private/generate-maproulette-tasks?apiKey=<KEY_FROM_ENV>
export async function GET(req: NextRequest) {
  const { access, response } = guardEnpoint(req, Schema)
  if (!access) return response
  try {
    const filter = undefined // Can be used for testing to only run certain campaigns
    // NOTE: We do not await the result here because that takes ~30 minutes
    maprouletteRebuildTasks(filter)
    return NextResponse.json({ message: 'TRIGGERED' }, { status: 200 })
  } catch (e) {
    console.error(e)
    if (!isProd) throw e
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

import { maprouletteRebuildTasks } from '@/scripts/MaprouletteRebuild/utils/maprouletteRebuildTasks'
import { isProd } from '@/src/app/_components/utils/isEnv'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { guardEnpoint } from '../_utils/guardEndpoint'

const Schema = z.object({
  apiKey: z.string(),
})

export async function GET(req: NextRequest) {
  const { access, response } = guardEnpoint(req, Schema)
  if (!access) return response
  try {
    // FOR TESTING
    const filter = 'test_maproulette_updates'
    await maprouletteRebuildTasks(filter)
    return NextResponse.json({ message: 'FINISHED' }, { status: 200 })
  } catch (e) {
    console.error(e)
    if (!isProd) throw e
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

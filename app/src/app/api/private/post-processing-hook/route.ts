import { isProd } from '@/src/app/_components/utils/isEnv'
import { registerSQLFunctions } from '@/src/server/instrumentation/registerSQLFunctions'
import { analysis } from '@/src/server/statistics/analysis/analysis'
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
    await registerSQLFunctions()
    analysis()
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (e) {
    console.error(e)
    if (!isProd) throw e
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

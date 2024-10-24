import { analysis } from '@/src/analysis/analysis'
import { isProd } from '@/src/app/_components/utils/isEnv'
import { registerSQLFunctions } from '@/src/registerSQLFunctions/registerSQLFunctions'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { guardEnpoint } from '../guardEndpoint'

const Schema = z.object({
  apiKey: z.string(),
})

export async function GET(req: NextRequest) {
  const { access, response } = guardEnpoint(req, Schema)
  if (!access) return response
  try {
    await registerSQLFunctions()
    analysis() // this may take some time, so we don't await it
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (e) {
    if (!isProd) throw e
    console.error(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
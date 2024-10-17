import { isProd } from '@/src/app/_components/utils/isEnv'
import { register } from '@/src/instrumentation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const RefreshSchema = z.object({
  apiKey: z.string(),
})

export async function GET(req: NextRequest) {
  // Parse and validate the query string
  let params
  try {
    const url = new URL(req.url)
    params = RefreshSchema.parse(Object.fromEntries(url.searchParams.entries()))
  } catch (e) {
    if (!isProd) throw e
    console.error(e)
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
  }

  // Check the API key
  try {
    if (params.apiKey !== process.env.ATLAS_API_KEY) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await register()

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (e) {
    if (!isProd) throw e
    console.error(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

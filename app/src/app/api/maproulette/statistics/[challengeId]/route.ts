import { isProd } from '@/src/app/_components/utils/isEnv'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const maprouletteChallengeId = z.object({ challengeId: z.coerce.number().positive() })

const maprouletteChallengeStatistic = z.array(
  z.strictObject({
    id: z.number(),
    name: z.string(),
    actions: z.object({
      total: z.number(),
      available: z.number(),
      fixed: z.number(),
      falsePositive: z.number(),
      skipped: z.number(),
      deleted: z.number(),
      alreadyFixed: z.number(),
      tooHard: z.number(),
      answered: z.number(),
      validated: z.number(),
      disabled: z.number(),
      avgTimeSpent: z.number(),
      tasksWithTime: z.number(),
    }),
  }),
)

export async function GET(request: NextRequest, { params }: { params: { challengeId: string } }) {
  const parsedParams = maprouletteChallengeId.safeParse({
    challengeId: params.challengeId,
  })

  // VALIDATE PARAMS
  if (parsedParams.success === false) {
    return NextResponse.json({ error: 'Invalid `challengeId`', parsedParams }, { status: 404 })
  }
  const { challengeId } = parsedParams.data

  try {
    const apiUrl = `https://maproulette.org/api/v2/data/challenge/${challengeId}`

    const response = await fetch(apiUrl, {
      // credentials: 'include',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        apiKey: process.env.MAPROULETTE_API_KEY,
      },
    })
    const json = await response.json()
    const parsed = maprouletteChallengeStatistic.safeParse(json)

    // RESPONSE
    if (parsed.success === false || !parsed.data[0]) {
      return NextResponse.json({ error: 'Invalid response', parsed, json }, { status: 500 })
    }

    return Response.json(parsed.data[0].actions)
  } catch (error) {
    if (isProd) console.error(error)
    return Response.json(
      {
        error: 'Internal Server Error',
        info: isProd ? undefined : error,
      },
      { status: 500 },
    )
  }
}

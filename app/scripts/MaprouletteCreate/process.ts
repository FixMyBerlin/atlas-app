import { $, Glob } from 'bun'
import { AstroCampaignSchema, MaprouletteCampaignCreationSchema } from 'cms/campaignsSchema'
import { startOfDay } from 'date-fns'
import invariant from 'tiny-invariant'
import { parseArgs } from 'util'
import { z } from 'zod'
import { buildHashtags } from './buildHashtags'
import { defaultChallenge } from './default.const'
import {
  CreateMapRouletteChallengeSchema,
  UpdateMapRouletteChallengeSchema,
  type CreateMapRouletteChallengeType,
  type UpdateMapRouletteChallengeType,
} from './schema'
import { maprouletteChallengeUrl } from './utils/maprouletteChallengeUrl'

// https://bun.sh/guides/process/argv
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    filter: { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

type ActionData = { slug: string } & z.infer<typeof MaprouletteCampaignCreationSchema>

function dataCreateChallenge({ slug, ...astroCampaignData }: ActionData) {
  const hashtags = buildHashtags(slug, astroCampaignData.category, true)
  const challengeData: CreateMapRouletteChallengeType = {
    ...defaultChallenge,
    name: astroCampaignData.title,
    infoLink: `https://radinfra.de/kampagnen/${slug}/`,
    remoteGeoJson: astroCampaignData.maprouletteChallenge.value.remoteGeoJson,
    enabled: astroCampaignData.maprouletteChallenge.value.enabled,
    description: astroCampaignData.description,
    checkinComment: `${astroCampaignData.maprouletteChallenge.value.checkinComment}  ${hashtags.join(' ')}`,
    checkinSource: astroCampaignData.maprouletteChallenge.value.checkinSource,
    dataOriginDate: startOfDay(new Date()).toISOString(), // We skip this; the tasks have their own updatedAt at the bottom of the task description
  }
  return CreateMapRouletteChallengeSchema.parse(challengeData)
}

function dataUpdateChallenge({ slug, ...astroCampaignData }: ActionData) {
  invariant(
    astroCampaignData.maprouletteChallenge.value.id,
    'challenge.id is required dataUpdateChallenge',
  )

  const challengeData: UpdateMapRouletteChallengeType = {
    ...dataCreateChallenge({ slug, ...astroCampaignData }),
    id: astroCampaignData.maprouletteChallenge.value.id,
  }
  return UpdateMapRouletteChallengeSchema.parse(challengeData)
}

async function updateChallenge(challenge: UpdateMapRouletteChallengeType) {
  const response = await fetch(`https://maproulette.org/api/v2/challenge/${challenge.id}`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      apiKey: process.env.MAPROULETTE_KEY!,
    },
    body: JSON.stringify(challenge),
  })

  if (!response.ok) {
    const error = `Failed to update challenge: ${response.statusText}`
    console.error(error, await response.json(), response)
    throw new Error(error)
  }

  const data = await response.json()
  // console.log('Challenge updated', data)
  return data
}

async function createChallenge(challenge: CreateMapRouletteChallengeType) {
  const response = await fetch('https://maproulette.org/api/v2/challenge', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      apiKey: process.env.MAPROULETTE_KEY!,
    },
    body: JSON.stringify(challenge),
  })

  if (!response.ok) {
    const error = `Failed to create challenge: ${response.statusText}`
    console.error(error, await response.json(), response)
    throw new Error(error)
  }

  const data = await response.json()
  // console.log('Challenge created', data)
  return data
}

async function main(filter: string | undefined) {
  const campaignsFolder = './src/content/campaigns'
  const glob = new Glob('**/*/index.json')
  const campaignPaths = glob.scan(campaignsFolder)

  for await (const campaignPath of campaignPaths) {
    // SKIP BY FILTER PARAM
    const skip = filter ? !campaignPath.includes(filter) : false
    const logPrefix = skip ? '\x1b[33m↷ SKIP\x1b[0m' : '\x1b[32m✎ PROCESS\x1b[0m'
    console.log('\t', logPrefix, campaignPath)
    if (skip) continue

    // LOAD JSON
    const [slug] = campaignPath.split('/')
    const filePath = `${campaignsFolder}/${campaignPath}`
    const json = await Bun.file(filePath).json()
    const parsed = AstroCampaignSchema.parse(json)

    // SKIP WHEN MR OFF
    if (parsed.maprouletteChallenge.discriminant === false) {
      console.log('\t', '\x1b[37m↷ SKIP\x1b[0m', slug, '(No MapRoulette)')
      continue
    }

    // ACTION
    const saveParsed = MaprouletteCampaignCreationSchema.parse(parsed) // A second time to mak TS happy
    const action = parsed.maprouletteChallenge.value.id ? 'UPDATE' : 'CREATE'
    invariant(slug)
    switch (action) {
      case 'CREATE':
        const createData = dataCreateChallenge({ slug, ...saveParsed })
        const challenge = await createChallenge(createData)
        // Write back the ID into the given Keystatic Content file
        const { id } = z.object({ id: z.number() }).parse(challenge)
        json.maprouletteChallenge.value.id = id
        await Bun.write(filePath, JSON.stringify(json, undefined, 2))
        console.log('\t\t', 'CREATED campaign', maprouletteChallengeUrl(id))
        break
      case 'UPDATE':
        const updateData = dataUpdateChallenge({ slug, ...json })
        await updateChallenge(updateData)
        console.log('\t\t', 'UPDATED campaign', maprouletteChallengeUrl(updateData.id))
        break
    }
  }

  // FORMATTING
  $`prettier 'src/content/campaigns/**/*.json' --write`
}

console.log(
  'STARTING maproulette/process',
  values.filter ? `–\x1b[33m using filter \"${values.filter}\"\x1b[0m` : '',
)
main(values.filter)

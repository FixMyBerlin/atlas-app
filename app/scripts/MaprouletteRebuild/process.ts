import { $, Glob } from 'bun'
import { AstroCampaignSchema, MaprouletteCampaignCreationSchema } from 'cms/campaignsSchema'
import { parseArgs } from 'util'
import { maprouletteChallengeUrl } from '../MaprouletteCreate/utils/maprouletteChallengeUrl'

// https://bun.sh/guides/process/argv
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    filter: { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

async function main(filter: string | undefined) {
  const campaignsFolder = './src/content/campaigns'
  const glob = new Glob('**/*/index.json')
  const campaignPaths = glob.scan(campaignsFolder)

  for await (const campaignPath of campaignPaths) {
    const [slug] = campaignPath.split('/')

    // LOAD JSON
    const filePath = `${campaignsFolder}/${campaignPath}`
    const json = await Bun.file(filePath).json()
    const parsed = AstroCampaignSchema.parse(json)

    // SKIP WHEN MR OFF
    if (parsed.maprouletteChallenge.discriminant === false) {
      console.log('\t', '\x1b[37m↷ SKIP\x1b[0m', slug)
      continue
    }

    const saveParsed = MaprouletteCampaignCreationSchema.parse(parsed) // A second time to mak TS happy

    // SKIP BY FILTER PARAM
    const skip = filter ? !campaignPath.includes(filter) : false
    const logPrefix = skip ? '\x1b[33m↷ SKIP\x1b[0m' : '\x1b[32m✎ PROCESS\x1b[0m'
    console.log('\t', logPrefix, slug, skip ? saveParsed.maprouletteChallenge.value.rebuildAt : '')
    if (skip) continue

    // ACTION
    const campaignId = saveParsed.maprouletteChallenge.value.id
    const url = `https://maproulette.org/api/v2/challenge/${campaignId}/rebuild?removeUnmatched=true&skipSnapshot=false`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        accept: '*/*',
        apiKey: process.env.MAPROULETTE_KEY!,
      },
    })

    if (!response.ok) {
      const error = `Failed to trigger rebuild for challenge: ${response.statusText}`
      console.error('\t\t', error, response, response)
      continue
    }

    // Write back the `rebuildAt` into the given Keystatic Content file
    json.maprouletteChallenge.value.rebuildAt = formatedDateTime()
    await Bun.write(filePath, JSON.stringify(json, undefined, 2))

    console.log('\t\t', 'TRIGGERED REBUILD for campaign', maprouletteChallengeUrl(campaignId))
  }

  // FORMATTING
  $`prettier 'src/content/campaigns/**/*.json' --write`
}

// Keystatic stores the date in a format that comes from the HTML datetime element
// It looks like there is no easy way to transform
function formatedDateTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

console.log(
  'STARTING maproulette-rebuild/process',
  values.filter ? `–\x1b[33m using filter \"${values.filter}\"\x1b[0m` : '',
)
main(values.filter)

import { campaigns } from '@/src/data/radinfra-de/campaigns'
import { CampaignMaprouletteSchema } from '@/src/data/radinfra-de/schema/campaignsSchema'
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
  for await (const campaign of campaigns) {
    // SKIP WHEN MR OFF
    if (campaign.maprouletteChallenge.enabled === false) {
      console.log('\t', '\x1b[37m↷ SKIP\x1b[0m', campaign.id)
      continue
    }

    const saveParsed = CampaignMaprouletteSchema.parse(campaign) // Second time gets rid of the enabled=false

    // SKIP BY FILTER PARAM
    const skip = filter ? !campaign.id.includes(filter) : false
    const logPrefix = skip ? '\x1b[33m↷ SKIP\x1b[0m' : '\x1b[32m✎ PROCESS\x1b[0m'
    console.log('\t', logPrefix, campaign.id, skip ? saveParsed.maprouletteChallenge.rebuildAt : '')
    if (skip) continue

    // ACTION
    const campaignId = saveParsed.maprouletteChallenge.id
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

    // TODO: Readd the part where we write back teh rebuildAt to the local data automatically
    console.log('\t\t', 'TRIGGERED REBUILD for campaign', maprouletteChallengeUrl(campaignId))
    console.log('\t\t', `NOW UPDATE campaign ${campaign.id} WITH`, {
      rebuildAt: new Date().toISOString(),
    })
  }

  // // FORMATTING
  // $`prettier 'src/content/campaigns/**/*.json' --write`
}

console.log(
  'STARTING MaprouletteRebuild',
  values.filter ? `–\x1b[33m using filter \"${values.filter}\"\x1b[0m` : '',
)
main(values.filter)

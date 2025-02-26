import { campaignsIncludingTest } from '@/src/data/radinfra-de/campaigns'
import { CampaignMaprouletteSchema } from '@/src/data/radinfra-de/schema/campaignsSchema'
import chalk from 'chalk'
import { parseArgs } from 'util'
import { maprouletteChallengeUrl } from '../MaprouletteCreate/utils/maprouletteChallengeUrl'
import { ChallengeStatus } from './utils/challengeStatus'
const { blue, gray, green, red, white, yellow } = chalk

// https://bun.sh/guides/process/argv
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    filter: { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

// We check the status of the challenge in order to learn if the rebuild actually worked
// and in order to slow down the script so we don't overwhelm the MR server.
// See https://github.com/maproulette/maproulette3/issues/2569
const RETRY_TIME_MS = 10 * 1000
const MAX_RETRIES = 50
const checkChallengeStatus = async (campaignId: number, retries = 0) => {
  const tab = '\t\t\t'

  const url = `https://maproulette.org/api/v2/challenge/${campaignId}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.log(
        tab,
        red('❌'),
        'Failed to fetch challenge status',
        response.status,
        response.statusText,
      )
      return 'max_retries_exceeded'
    }

    const challenge = await response.json()
    const challengeStatus = challenge.status

    if (retries >= MAX_RETRIES) {
      console.log(tab, red(`Challenge build failed after ${MAX_RETRIES} retries.`))
      return 'failed'
    }

    const msgWaiting = `Waiting for ${Math.round(RETRY_TIME_MS / 1000)} seconds…`
    const msgRetry = `${retries} / ${MAX_RETRIES}`
    switch (challengeStatus) {
      case ChallengeStatus.building:
        console.log(tab, blue('Challenge is rebuilding tasks.'), msgWaiting, msgRetry)
        await Bun.sleep(RETRY_TIME_MS)
        return checkChallengeStatus(campaignId, retries + 1)
      case ChallengeStatus.failed:
        console.log(tab, red('Challenge build failed.'))
        return 'failed'
      case ChallengeStatus.ready:
        console.log(tab, green('Challenge is ready.'))
        return 'ready'
      case ChallengeStatus.partiallyLoaded:
        console.log(tab, blue('Challenge is partially loaded.'), msgWaiting, msgRetry)
        await Bun.sleep(RETRY_TIME_MS)
        return checkChallengeStatus(campaignId, retries + 1)
      case ChallengeStatus.finished:
        console.log(tab, green('Challenge is finished.'))
        console.log(
          '\t\t',
          yellow('NOW: Update this challenge to be completed'),
          maprouletteChallengeUrl(campaignId),
        )
        return 'finished'
      case ChallengeStatus.deletingTasks:
        console.log(tab, blue('Challenge is deleting tasks.'), msgWaiting, msgRetry)
        await Bun.sleep(RETRY_TIME_MS)
        return checkChallengeStatus(campaignId, retries + 1)
      case ChallengeStatus.none:
      case ChallengeStatus.empty:
      default:
        console.log(tab, red('ℹ️'), 'Challenge has no status or unknown status.')
        return 'failed'
    }
  } catch (error) {
    console.log(tab, red('Error fetching challenge status:'), error)
    return 'failed'
  }
}

async function main(filter: string | undefined) {
  for await (const campaign of campaignsIncludingTest) {
    // SKIP WHEN MR OFF
    if (campaign.maprouletteChallenge.enabled === false) {
      console.log('\t', white('↷ SKIP'), campaign.id)
      continue
    }

    const saveParsed = CampaignMaprouletteSchema.parse(campaign) // Second time gets rid of the enabled=false
    const campaignId = saveParsed.maprouletteChallenge.id
    const challengeUrl = maprouletteChallengeUrl(campaignId)
    if (!campaignId) {
      console.log('\t', yellow('↷ SKIP'), 'No campaignId', campaignId)
      continue
    }

    // SKIP BY FILTER PARAM
    const skip = filter ? !campaign.id.includes(filter) : false
    const logPrefix = skip ? yellow('↷ SKIP') : green('✎ PROCESS')
    console.log('\t', logPrefix, campaign.id, gray(challengeUrl))
    if (skip) continue

    // ACTION
    const apiUrl = `https://maproulette.org/api/v2/challenge/${campaignId}/rebuild?removeUnmatched=true&skipSnapshot=true`
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: { apiKey: process.env.MAPROULETTE_KEY!, accept: '*/*' },
    })

    if (!response.ok) {
      // https://github.com/maproulette/maproulette3/issues/2569
      if (response.status === 502 || response.status === 400) {
        const msgError = yellow('Server responded with "expected" error')
        console.log('\t\t', msgError, response.status, response.statusText)

        const status = await checkChallengeStatus(campaignId)
        if (status === 'failed') {
          console.log('\t\t', red('Rebuild failed for campaign'), campaign.id)
          continue
        }
      } else {
        const msgError = red('Failed to trigger rebuild for challenge')
        console.error('\t\t', msgError, response.statusText, response)
        continue
      }
    }

    // TODO: Find a way to store this automatically
    console.log('\t\t', `REBUILD FINISHED. NOW UPDATE campaign ${campaign.id} WITH`, {
      rebuildAt: new Date().toISOString(),
    })
  }

  // // FORMATTING
  // $`prettier 'src/content/campaigns/**/*.json' --write`
}

console.log(
  'STARTING MaprouletteRebuild',
  values.filter ? `– ${yellow(`using filter "${values.filter}"`)}` : '',
)
main(values.filter)

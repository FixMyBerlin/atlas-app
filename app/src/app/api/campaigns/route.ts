import { campaigns } from '@/src/data/radinfra-de/campaigns'
import { buildHashtags } from '@/src/data/radinfra-de/utils/buildHashtags'
import { CAMPAIGN_API_BASE_URL } from '../maproulette/data/[projectKey]/_utils/campaignApiBaseUrl.const'

export async function GET() {
  const result = campaigns.map((campaign) => {
    return {
      ...campaign,
      remoteGeoJson: `${CAMPAIGN_API_BASE_URL}${campaign.id}`,
      hashtags: buildHashtags(
        campaign?.id,
        campaign?.category,
        campaign?.maprouletteChallenge.enabled === true,
      ),
    }
  })
  return Response.json(result)
}

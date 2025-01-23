import { campaignTitleTranslations } from '@/src/app/api/maproulette/[projectKey]/_utils/campaignTitleTranslations.const'
import { TodoId, todoIds } from '@/src/processingTypes/todoId'
import { FileMapDataSubcategory, FileMapDataSubcategoryStyleLegend } from '../types'
import { mapboxStyleGroupLayers_radinfra_campaign } from './mapboxStyles/groups/radinfra_campaign'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'campaigns'
const source = 'atlas_todos_lines'
const sourceLayer = 'todos_lines'
export type SubcatRadinfraCampaignId = typeof subcatId
export type SubcatRadinfraCampaignStyleIds = 'default' | TodoId

export const campaignLegend: FileMapDataSubcategoryStyleLegend[] = [
  {
    id: 'todo',
    name: 'Hier gibt es was zu tun',
    style: {
      type: 'line',
      color: '#a97bea',
    },
  },
]

export const subcat_radinfra_campaigns: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Kampagnen',
  ui: 'dropdown',
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Alle Kampagnen',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_radinfra_campaign,
        source,
        sourceLayer,
      }),
      legends: campaignLegend,
    },
    ...todoIds.map((todoId) => {
      return {
        id: todoId,
        name: campaignTitleTranslations[todoId],
        desc: null,
        layers: mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_radinfra_campaign,
          source,
          sourceLayer,
          additionalFilter: ['has', todoId],
        }),
        legends: campaignLegend,
      }
    }),
  ],
}

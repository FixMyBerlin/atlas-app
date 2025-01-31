import { TodoId, todoIds } from '@/src/processingTypes/todoIds.const'
import { radinfraDeCampaigns } from '../../../(index)/_data/radinfraDeCampaigns.generated.const'
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
  beforeId: 'atlas-app-beforeid-top',
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
      const headline = radinfraDeCampaigns.find((c) => c.id === todoId)?.menuTitle
      return {
        id: todoId,
        name: headline || `(Unbekannte Überschrift für ${todoId})`,
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

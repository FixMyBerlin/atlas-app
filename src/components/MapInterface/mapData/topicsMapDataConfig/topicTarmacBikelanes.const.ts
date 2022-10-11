import { MapDataTopic, MapDataVisLayer } from '../types'
import { tarmacStyle } from './utils'

export type TopicTarmacBikelanesId = 'bikelanes'
export type TopicTarmacBikelanesStyleIds = 'default' | 'detailed'
export type TopicTarmacBikelanesStyleFilterIds = '_nofilter'

const layers = tarmacStyle.layers.filter(
  (s) => s.metadata.groupName === `fmc-radinfra`
) as MapDataVisLayer[] // TODO types on tarmacStyle

export const topicTarmacBikelanes: MapDataTopic = {
  id: 'bikelanes',
  name: 'Fahrradinfrastruktur',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmacHighways',
  defaultVisible: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers,
      interactiveFilters: null,
    },
    {
      id: 'detailed',
      name: 'Detailliert',
      desc: 'Kleinteilige Kategorisierung',
      layers,
      interactiveFilters: null,
    },
  ],
}

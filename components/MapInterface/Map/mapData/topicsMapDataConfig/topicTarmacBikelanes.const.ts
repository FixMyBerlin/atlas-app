import { MapDataConfigTopic, MapDataConfigVisLayer } from '../types'
import { tarmacStyle } from './utils'

export type TopicTarmacBikelanesId = 'bikelanes'
export type TopicTarmacBikelanesStyleIds = 'default' | 'detailed'
export type TopicTarmacBikelanesStyleFilterIds = ''

const layers = tarmacStyle.layers.filter(
  (s) => s.metadata.groupName === `fmc-radinfra`
) as MapDataConfigVisLayer[] // TODO types on tarmacStyle

export const topicTarmacBikelanes: MapDataConfigTopic = {
  id: 'bikelanes',
  name: 'Fahrradinfrastruktur',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmacHighways',
  visible: true,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      visible: true,
      layers,
      interactiveFilters: null,
    },
    {
      id: 'detailed',
      name: 'Detailliert',
      desc: 'Kleinteilige Kategorisierung',
      visible: false,
      layers,
      interactiveFilters: null,
    },
  ],
}

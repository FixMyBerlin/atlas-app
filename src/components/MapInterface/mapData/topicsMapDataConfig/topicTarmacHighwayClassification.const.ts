import { MapDataConfigTopic, MapDataConfigVisLayer } from '../types'
import { tarmacStyle } from './utils'

export type TopicTarmacHighwayClassificationId = 'highwayClassification'
export type TopicTarmacHighwayClassificationStyleIds = 'zes' | 'osm'
export type TopicTarmacHighwayClassificationStyleFilterIds = '_nofilter'

const layers = tarmacStyle.layers.filter(
  (s) => s.metadata.groupName === `fmc-strassentypen`
) as MapDataConfigVisLayer[] // TODO types on tarmacStyle

export const topicTarmacHighwayClassification: MapDataConfigTopic = {
  id: 'highwayClassification',
  name: 'Straßentypen',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmacHighways',
  defaultVisible: false,
  styles: [
    {
      id: 'zes',
      name: 'Erweitert',
      desc: 'Straßenklassifizierung basierend auf verschiedenen OSM Indikatoren.',
      layers,
      interactiveFilters: null,
    },
    {
      id: 'osm',
      name: 'OpenStreetMap',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers,
      interactiveFilters: null,
    },
  ],
}

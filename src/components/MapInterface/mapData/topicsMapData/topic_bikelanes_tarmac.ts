import { MapDataTopic } from '../types'

const topic = 'bikelanes_tarmac'
export type TopicBikelanesId_Tarmac = typeof topic
export type TopicBikelanesStyleIds_Tarmac = 'default' | 'detailed'
export type TopicBikelanesStyleFilterIds_Tarmac = '_nofilter'

export const topic_bikelanes_tarmac: MapDataTopic = {
  id: topic,
  name: 'Fahrradinfrastruktur',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmac_bikelanes',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'line',
          source: 'tarmac_bikelanes',
          'source-layer': 'public.bicycleRoadInfrastructure',
          paint: {
            'line-color': 'HotPink',
            'line-width': 10,
          },
          enableInspector: true,
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
  ],
}

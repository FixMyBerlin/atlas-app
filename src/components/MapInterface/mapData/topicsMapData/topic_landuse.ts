import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'landuse'
export type TopicLanduseId = typeof topic
export type TopicLanduseStyleIds = 'default'
export type TopicLanduseStyleFilterIds = '_nofilter'

export const topic_landuse: MapDataTopic = {
  id: topic,
  name: 'Wohn- und Gewerbegebiete',
  desc: null,
  sourceId: 'tarmac_landuse',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_landuse',
        source: 'tarmac_landuse',
        sourceLayer: 'public.landuse',
      }),
      legends: [
        {
          id: 'residential',
          name: 'Wohngegend',
          style: { type: 'fill', color: 'hsl(17, 94%, 81%)' },
        },
        {
          id: 'non-residential',
          name: 'Gewerbe',
          style: { type: 'fill', color: 'hsl(215, 88%, 78%)' },
        },
      ],
      interactiveFilters: null,
    },
  ],
}

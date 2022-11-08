import { MapDataTopic } from '../types'
import { MapboxStyleLayerGroupLanduseIds } from './mapboxStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'landuse'
export type TopicLanduseId = typeof topic
export type TopicLanduseStyleIds = 'default' | MapboxStyleLayerGroupLanduseIds
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
      interactiveFilters: null,
    },
  ],
}

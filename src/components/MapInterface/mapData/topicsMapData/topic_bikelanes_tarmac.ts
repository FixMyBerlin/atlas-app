import { MapDataTopic } from '../types'
import { MapboxStyleLayerGroupBikelanesIds } from './mapboxStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'bikelanes_tarmac'
export type TopicBikelanesId_Tarmac = typeof topic
export type TopicBikelanesStyleIds_Tarmac =
  | 'default'
  | MapboxStyleLayerGroupBikelanesIds
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
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bicycleRoadInfrastructure',
      }),
      interactiveFilters: null,
    },
    {
      id: 'atlas_bikelanes_complete',
      name: 'Vollständigkeit',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_complete',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bicycleRoadInfrastructure',
      }),
      interactiveFilters: null,
    },
    {
      id: 'atlas_bikelanes_fresh',
      name: 'Aktualität',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_fresh',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bicycleRoadInfrastructure',
      }),
      interactiveFilters: null,
    },
    {
      id: 'atlas_bikelanes_verified',
      name: 'Prüf-Status',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_verified',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bicycleRoadInfrastructure',
      }),
      interactiveFilters: null,
    },
    {
      id: 'atlas_bikelanes_complete_fresh_verified',
      name: 'Vollansicht',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_complete_fresh_verified',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bicycleRoadInfrastructure',
      }),
      interactiveFilters: null,
    },
  ],
}

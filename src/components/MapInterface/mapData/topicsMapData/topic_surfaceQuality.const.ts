import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topicId = 'surfaceQuality'
const source = 'tarmac_surfaceQuality'
const sourceLayer = 'public.surfaceQuality'
export type TopicSurfaceQualityId = typeof topicId
export type TopicSurfaceStyleQualityIds =
  | 'default'
  | 'bad'
  | 'debug-smoothness'
  | 'completeness'
  | 'freshness'

export const topic_surfaceQuality: MapDataTopic = {
  id: topicId,
  name: 'Oberflächenqualität',
  desc: '`smoothness`, `surface` und interpolationen. Für alle Fahrrad-relevanten Wege.',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({ group: 'atlas_surface_good', source, sourceLayer }),
    },
    {
      id: 'bad',
      name: 'Schlechte Oberflächen',
      desc: 'Hervorhebung von schlechten Oberflächen.',
      layers: mapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
    },
    {
      id: 'completeness',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: [
        mapboxStyleLayers({ group: 'atlas_surface_present', source, sourceLayer }),
        mapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
      ].flat(),
      legends: [
        {
          id: 'missing',
          name: 'Daten fehlen',
          style: {
            type: 'line',
            color: 'hsl(312, 92%, 74%)',
          },
        },
      ],
    },
    {
      id: 'freshness',
      name: 'Inhalte & Aktualität',
      desc: null,
      layers: [
        mapboxStyleLayers({ group: 'atlas_surface_fresh', source, sourceLayer }),
        mapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
      ].flat(),
      legends: [],
    },
  ],
}

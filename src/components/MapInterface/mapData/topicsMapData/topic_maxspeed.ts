import { MapDataTopic } from '../types'
import { debugLayerStyles } from './mapboxStyles/debugLayerStyles'

const tpoicId = 'maxspeed'
const source = 'tarmac_maxspeed'
const sourceLayer = 'public.maxspeed'
export type TopicMaxspeedId = typeof tpoicId
export type TopicMaxspeedStyleIds = 'default' | 'source'
export type TopicMaxspeedStyleFilterIds = '_nofilter'

export const topic_maxspeed: MapDataTopic = {
  id: tpoicId,
  name: 'Höchstgeschwindigkeit',
  desc: '', // todo
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Höchstgeschwindigkeit',
      desc: '', // todo
      layers: debugLayerStyles({ source, sourceLayer }),
      interactiveFilters: null,
    },
    {
      id: 'source',
      name: 'Quelle',
      desc: 'Visualisierung der Datenquellen',
      layers: debugLayerStyles({ source, sourceLayer }),
      interactiveFilters: null,
      legends: [
        {
          id: 'maxspeedDirect',
          name: 'Explizit erfasst `max("maxspeed:forward", "maxspeed:backward", "maxspeed")`',
          style: {
            type: 'line',
            color: 'hsla(232, 99%, 39%, 0.34)',
            dasharray: [7, 3],
          },
        },
        {
          id: 'maxspeedFromZone',
          name: 'Via Zone (maxspeed_type, zone:maxspeed, source:maxspeed)',
          style: {
            type: 'line',
            color: 'hsla(232, 99%, 39%, 0.34)',
            dasharray: [7, 3],
          },
        },
        {
          id: 'inferred-from-highway',
          name: 'Verkehrsberuhigter Bereich',
          style: {
            type: 'line',
            color: 'hsla(232, 99%, 39%, 0.34)',
            dasharray: [7, 3],
          },
        },
        {
          id: 'infereed-from-landuse',
          name: 'Via Wohngebiete',
          style: {
            type: 'line',
            color: 'hsla(232, 99%, 39%, 0.34)',
            dasharray: [7, 3],
          },
        },
        {
          id: 'nothing-found',
          name: 'Unbekannt',
          style: {
            type: 'line',
            color: 'hsla(232, 99%, 39%, 0.34)',
            dasharray: [7, 3],
          },
        },
      ],
    },
  ],
}

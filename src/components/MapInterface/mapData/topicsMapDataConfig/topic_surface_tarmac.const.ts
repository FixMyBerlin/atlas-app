import { MapDataTopic } from '../types'
import { pickLayersByGroup, tarmacStyle } from './utils'

const topicId = 'surface_tarmac'
export type TopicSurfaceId_Tarmac = typeof topicId
export type TopicSurfaceStyleIds_Tarmac = 'default' | 'bad' | 'debug-smoothness'
export type TopicSurfaceStyleFilterIds_Tarmac = '_nofilter'

// TODO we dont have the data, yet. This is prepared but not used in mapData
export const topic_surface_tarmac: MapDataTopic = {
  id: topicId,
  name: 'Oberflächenqualität',
  desc: '`smoothness`, `surface` und interpolationen. Für alle Fahrrad-relevanten Wege.',
  sourceId: 'osmscripts_highways', // TODO we dont have this data, yet
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(
        tarmacStyle.layers,
        'fmc-oberflaechenqualitaet'
      ),
      interactiveFilters: null,
    },
    {
      // TODO der default layer wird nicht richtig versteckt, wenn ich auf 'bad' wechsel
      id: 'bad',
      name: 'Schlechte Oberflächen',
      desc: 'Hervorhebung von schlechten Oberflächen.',
      layers: pickLayersByGroup(tarmacStyle.layers, 'fmc-surface-bad'),
      interactiveFilters: null,
    },
    {
      id: 'debug-smoothness',
      name: 'Debug: Smoothness',
      desc: '`smoothness` Tag fehlt.',
      layers: pickLayersByGroup(
        tarmacStyle.layers,
        'fmc-oberflaechenqualitaet'
      ),
      interactiveFilters: null,
    },
  ],
}

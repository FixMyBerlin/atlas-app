import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { atlasStyle, pickLayersByGroup } from './utils'

const topicId = 'surface_osmscripts'
export type TopicSurfaceId_Osmscripts = typeof topicId
export type TopicSurfaceStyleIds_Osmscripts = 'default' | 'bad' | 'debug-smoothness'

export const topic_surface_osmscripts: MapDataTopic = {
  id: topicId,
  name: 'Oberflächenqualität (osmscripts)',
  desc: '`smoothness`, `surface` und interpolationen. Für alle Fahrrad-relevanten Wege.',
  sourceId: 'osmscripts_highways',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-oberflaechenqualitaet'),
    },
    {
      // TODO der default layer wird nicht richtig versteckt, wenn ich auf 'bad' wechsel
      id: 'bad',
      name: 'Schlechte Oberflächen',
      desc: 'Hervorhebung von schlechten Oberflächen.',
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-surface-bad'),
    },
    {
      id: 'debug-smoothness',
      name: 'Debug: Smoothness',
      desc: '`smoothness` Tag fehlt.',
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-oberflaechenqualitaet'),
    },
  ],
}

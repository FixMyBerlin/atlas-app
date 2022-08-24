import { MapDataConfigTopic } from '../types'

export type TopicTarmacSurfaceId = 'surface'
export type TopicTarmacSurfaceStyleIds = 'default' | 'debug-smoothness'
export type TopicTarmacSurfaceStyleFilterIds = ''

type Topic = MapDataConfigTopic

export const topicTarmacSurface: Topic = {
  id: 'surface',
  name: 'Oberflächenqualität',
  desc: '`smoothness`, `surface` und interpolationen. Für alle Fahrrad-relevanten Wege.',
  sourceId: 'tarmacHighways',
  visible: true,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      visible: true,
      layers: [],
      interactiveFilters: null,
    },
    {
      id: 'debug-smoothness',
      name: 'Debug: Smoothness',
      desc: '`smoothness` Tag fehlt.',
      visible: false,
      layers: [],
      interactiveFilters: null,
    },
  ],
}

import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'roads_legacy'
const source = 'atlas_roadClassification'
const sourceLayer = 'roadClassification'
export type SubcatRoadsIdLegacy = typeof subcatId
export type SubcatRoadsStyleIdsLegacy = 'default' | 'oneway'

export const subcat_roads_legacy: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Straßentypen (OLD)',
  ui: 'dropdown',
  sourceId: source,
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard (Legacy)',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: legacyMapboxStyleLayers({
        group: 'atlas_old_roadclassification',
        source,
        sourceLayer,
      }),
      legends: [
        // See https://wiki.openstreetmap.org/wiki/DE:Key:highway
        {
          id: 'primary-motorway-secondary-trunk',
          name: 'Hauptstraßen u.a.',
          style: { type: 'line', width: 9, color: '#dab07c' },
        },
        {
          id: 'tertiary',
          name: 'Verbindungsstraßen',
          style: { type: 'line', width: 7, color: '#dab07c' },
        },
        {
          id: 'unclassified',
          name: 'Nebenstraße u.a.',
          style: { type: 'line', width: 6, color: '#e6d6a2' },
        },
        {
          id: 'residential',
          name: 'Wohnstraße',
          style: { type: 'line', width: 2, color: '#9a987e' },
        },
        {
          id: 'living_street-pedestrian-bicycle_road',
          name: 'Verkehrsberuhigt u.a.',
          style: { type: 'line', width: 2, color: '#80a3ea' },
        },
        {
          id: 'service_road-service_alley',
          name: 'Zufahrtsweg',
          style: { type: 'line', width: 2, color: '#e6d6a2' },
        },
        // {
        //   id: 'service_drive_through-service_parking_aisle',
        //   name: 'Zufahrtsweg (…)',
        //   style: { type: 'line', width: 2, color: 'rgba(251, 40, 40, 0)' },
        // },
        {
          id: 'path-track-bridleway',
          name: 'Pfad, Wald-, Feldweg u.a.',
          style: { type: 'line', width: 2, color: '#b4aac0' },
        },
        {
          id: 'footway-cycleway',
          name: 'Fuß- & Radwege',
          style: { type: 'line', width: 2, color: '#b9aac0' },
        },
      ],
    },
    {
      id: 'oneway',
      name: 'Einbahnstraßen (Legacy)',
      desc: 'Hervorhebung von Einbahnstraßen.',
      layers: [
        legacyMapboxStyleLayers({
          group: 'atlas_oneway',
          source,
          sourceLayer,
        }),
        legacyMapboxStyleLayers({
          group: 'atlas_old_roadclassification',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'car_and_bike',
          name: 'Einbahnstraße',
          style: {
            type: 'line',
            color: 'rgb(255, 131, 82)',
          },
        },
        {
          id: 'car_not_bike',
          name: 'Einbahnstraße, Fahrrad frei',
          style: {
            type: 'line',
            color: 'rgb(211, 238, 88)',
          },
        },
      ],
    },
  ],
}

// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_bikelanes_details: MapboxStyleLayer[] = [
  {
    id: 'needsClarification-details',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#b50382',
      'line-dasharray': [2.5, 0.5],
    },
    filter: [
      'match',
      ['get', 'category'],
      [
        'needsClarification',
        'footwayBicycleYes_adjoiningOrIsolated',
        'footAndCyclewayShared_adjoiningOrIsolated',
        'footAndCyclewaySegregated_adjoiningOrIsolated',
      ],
      true,
      false,
    ],
  },
  {
    id: 'Gemeinsamer Fahrstreifen mit Kfz Markiert',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#059669',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-dasharray': [2, 1],
    },
    filter: ['match', ['get', 'category'], ['sharedMotorVehicleLane'], true, false],
  },
  {
    id: 'Gemeinsamer Fahrstreifen mit Bus',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#059669',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
    filter: ['match', ['get', 'category'], ['sharedBusLane'], true, false],
  },
  {
    id: 'Fahrradstrasse Mischverkehr',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#fb923c',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-dasharray': [2, 1],
    },
    filter: ['match', ['get', 'category'], ['bicycleRoad_vehicleDestination'], true, false],
  },
  {
    id: 'Fahrradstrasse keine Kfz',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#fb923c',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
    filter: ['match', ['get', 'category'], ['bicycleRoad'], true, false],
  },
  {
    id: 'Verkehrsberuhigter Bereich',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-dasharray': [1, 2],
      'line-color': '#ec4899',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
    filter: ['match', ['get', 'category'], ['livingStreet'], true, false],
  },
  {
    id: 'Gehweg mit Rad frei',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-dasharray': [2, 1],
      'line-color': '#ec4899',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
    filter: [
      'match',
      ['get', 'category'],
      [
        'pedestrianAreaBicycleYes',
        'footwayBicycleYes_isolated',
        'footwayBicycleYes_adjoiningOrIsolated',
        'footwayBicycleYes_adjoining',
      ],
      true,
      false,
    ],
  },
  {
    id: 'Gemeinsamer Geh u Radweg',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#ec4899',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
    filter: [
      'match',
      ['get', 'category'],
      [
        'footAndCyclewayShared_adjoining',
        'footAndCyclewayShared_isolated',
        'footAndCyclewayShared_adjoiningOrIsolated',
      ],
      true,
      false,
    ],
  },
  {
    id: 'Markierung Kreuzungsbereich',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#748b82',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-dasharray': [2, 1],
    },
    filter: ['match', ['get', 'category'], ['crossing'], true, false],
  },
  {
    id: 'Schutzstreifen',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#2dd4bf',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-dasharray': [2, 1],
    },
    filter: [
      'match',
      ['get', 'category'],
      [
        'cyclewayOnHighwayBetweenLanes',
        'cyclewayOnHighway_advisory',
        'cyclewayOnHighway_advisoryOrExclusive',
      ],
      true,
      false,
    ],
  },
  {
    filter: ['match', ['get', 'category'], ['cyclewayOnHighway_exclusive'], true, false],
    type: 'line',
    id: 'Radfahrstreifen',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#2dd4bf',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
  },
  {
    filter: [
      'all',
      ['match', ['get', 'category'], '', true, false],
      [
        'match',
        ['get', 'osm_separation:left'],
        [
          'solid_line;parking_lane',
          'bollard;parking_lane',
          'separation_kerb;parking_lane',
          'separation_kerb;vertical_panel',
          'planter',
          'bump',
          'vertical_panel',
          'bollard;kerb',
          'flex_post',
          'vertical_panel;parking_lane',
          'parking_lane',
          'kerb',
          'bollard',
          'separation_kerb',
        ],
        true,
        false,
      ],
    ],
    type: 'line',
    id: 'Geschuetzter Radfahrstreifen',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#7a0ff5',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
  },
  {
    filter: [
      'match',
      ['get', 'category'],
      ['cycleway_isolated', 'cycleway_adjoiningOrIsolated', 'cycleway_adjoining'],
      true,
      false,
    ],
    type: 'line',
    id: 'Getrennter Radweg',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#174ed9',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
  },
  {
    id: 'Getrennter Rad- und Gehweg',
    type: 'line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 2, 16, 3],
      'line-color': '#818cf8',
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
    },
    filter: [
      'match',
      ['get', 'category'],
      [
        'footAndCyclewaySegregated_adjoiningOrIsolated',
        'footAndCyclewaySegregated_adjoining',
        'footAndCyclewaySegregated_isolated',
      ],
      true,
      false,
    ],
  },
  {
    id: 'hitarea-bikelanes-details',
    type: 'line',
    paint: {
      'line-color': 'hsl(290, 100%, 54%)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 14.1, 10, 22, 12],
      'line-opacity': 0,
    },
    filter: ['has', 'category'],
    layout: {
      'line-cap': 'round',
    },
  },
]

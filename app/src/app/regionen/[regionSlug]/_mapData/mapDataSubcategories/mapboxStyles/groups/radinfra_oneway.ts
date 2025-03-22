// DO NOT EDIT MANUALLY
// This file was automatically generated by `scripts/MapboxStyles/process.ts`

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_radinfra_oneway: MapboxStyleLayer[] = [
  {
    type: 'line',
    id: 'oneway-color',
    paint: {
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 16, 4],
      'line-color': [
        'match',
        ['get', 'oneway'],
        ['no'],
        '#00c29e',
        ['yes'],
        '#a1e217',
        ['car_not_bike'],
        '#00c29e',
        'black',
      ],
      'line-opacity': ['match', ['get', 'oneway'], ['car_not_bike'], 0.5, 1],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'oneway'], ['no', 'yes', 'car_not_bike'], true, false],
  },
  {
    type: 'line',
    id: 'oneway-color-dashed',
    paint: {
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 16, 4],
      'line-color': '#00c29e',
      'line-dasharray': [0.1, 1.5],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'oneway'], ['car_not_bike'], true, false],
  },
  {
    type: 'line',
    id: 'oneway-missing',
    paint: {
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 22, 4],
      'line-color': [
        'match',
        ['get', 'oneway'],
        ['assumed_no'],
        '#fda5e4',
        ['implicit_yes'],
        '#d8a5fd',
        'black',
      ],
      'line-dasharray': [3, 1],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'oneway'], ['implicit_yes', 'assumed_no'], true, false],
  },
  {
    type: 'line',
    id: 'hitarea-missing-oneway',
    paint: {
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 14.1, 10, 22, 12],
      'line-color': 'rgb(216, 20, 255)',
      'line-dasharray': [3, 1],
      'line-opacity': 0,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'oneway'], ['implicit_yes', 'assumed_no'], true, false],
  },
  {
    type: 'line',
    id: 'oneway-zoomed-out',
    paint: {
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 16, 4],
      'line-color': 'gray',
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    filter: ['!', ['has', 'oneway']],
  },
]

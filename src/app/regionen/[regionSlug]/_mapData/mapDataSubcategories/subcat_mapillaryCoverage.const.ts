import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'

const subcatId = 'mapillaryCoverage'
export type SubcatMapillaryCoverageId = typeof subcatId
export type SubcatMapillaryCoverageStyleIds = 'default' | 'pano'

export const subcat_mapillaryCoverage: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Mapillary',
  ui: 'dropdown',
  sourceId: 'mapillary_coverage',
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      legends: [
        {
          id: 'action-cam',
          name: 'Klassische Fotos',
          style: {
            type: 'line',
            color: 'green',
          },
        },
        {
          id: 'action-360',
          name: '360° Fotos',
          style: {
            type: 'line',
            color: 'blue',
          },
        },
      ],
      layers: [
        {
          id: 'point-click-target',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': 10,
            'circle-color': 'transparent',
          },
        },
        {
          id: 'point',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': 3,
            'circle-blur': 0.5,
            'circle-color': ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
          },
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            'line-color': ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 14, 0.4],
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.2, 12, 0.5, 14, 1],
          },
          interactive: false,
        },
      ],
    },
    {
      id: 'pano',
      name: 'Nur Panorama-Fotos',
      desc: null,
      layers: [
        {
          id: 'point-click-target',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': 10,
            'circle-color': 'transparent',
          },
          filter: ['==', ['get', 'is_pano'], true],
        },
        {
          id: 'point',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': 3,
            'circle-blur': 0.5,
            'circle-color': ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
          },
          filter: ['==', ['get', 'is_pano'], true],
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            'line-color': ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 14, 0.4],
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.2, 12, 0.5, 14, 1],
          },
          filter: ['==', ['get', 'is_pano'], true],
          interactive: false,
        },
      ],
    },
  ],
}

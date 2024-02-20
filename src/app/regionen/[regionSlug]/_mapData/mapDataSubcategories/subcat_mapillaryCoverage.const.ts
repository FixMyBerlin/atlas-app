import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'

const subcatId = 'mapillaryCoverage'
export type SubcatMapillaryCoverageId = typeof subcatId
export type SubcatMapillaryCoverageStyleIds = 'default' | 'all' | 'age' | 'pano'

export const subcat_mapillaryCoverage: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Mapillary',
  ui: 'dropdown',
  sourceId: 'mapillary_coverage',
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Aktuelle Fotos (2 Jahre)',
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
          filter: [
            'case',
            ['<', ['get', 'captured_at'], new Date().setFullYear(new Date().getFullYear() - 2)],
            false,
            true,
          ],
        },
        {
          id: 'direction',
          type: 'symbol',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'icon-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 16, 0, 17, 0.95],
          },
          layout: {
            'icon-image': 'chevron-double-right',
            'icon-rotate': ['get', 'compass_angle'],
            'icon-size': ['interpolate', ['linear'], ['zoom'], 16, 0.4, 17, 0.75, 19, 0.9],
            'icon-offset': [13, 0],
            // 'icon-allow-overlap': true,
            // 'icon-padding': 0.5,
          },
          filter: [
            'case',
            ['<', ['get', 'captured_at'], new Date().setFullYear(new Date().getFullYear() - 2)],
            false,
            true,
          ],
        },
        {
          id: 'point',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 0.1, 14.5, 3, 15, 3, 17, 5],
            'circle-blur': 0.5,
            'circle-color': ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
          },
          filter: [
            'case',
            ['<', ['get', 'captured_at'], new Date().setFullYear(new Date().getFullYear() - 2)],
            false,
            true,
          ],
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            'line-color': ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 14, 0.4],
            'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 10, 1.5, 14, 2, 14.6, 1.3],
          },
          filter: [
            'case',
            ['<', ['get', 'captured_at'], new Date().setFullYear(new Date().getFullYear() - 2)],
            false,
            true,
          ],
          interactive: false,
        },
      ],
    },
    {
      id: 'all',
      name: 'Alle Fotos',
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
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 0.1, 14.5, 3, 15, 3, 17, 5],
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
            'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 10, 1.5, 14, 2, 14.6, 1.3],
          },
          interactive: false,
        },
      ],
    },
    {
      id: 'age',
      name: 'Alter',
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
        },
        {
          id: 'point',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 0.1, 14.5, 3, 15, 3, 17, 5],
            'circle-blur': 0.5,
            'circle-color': [
              'step',
              ['get', 'captured_at'],
              '#F77E5E',
              new Date().setFullYear(new Date().getFullYear() - 4),
              '#FFC01B',
              new Date().setFullYear(new Date().getFullYear() - 2),
              '#05CB63',
            ],
          },
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            // For zoom 0-14 we color by age, after by type (blue/green)
            'line-color': [
              'step',
              ['zoom'],
              [
                'step',
                ['get', 'captured_at'],
                '#F77E5E',
                new Date().setFullYear(new Date().getFullYear() - 4),
                '#FFC01B',
                new Date().setFullYear(new Date().getFullYear() - 2),
                '#05CB63',
              ],
              14,
              ['case', ['==', ['get', 'is_pano'], true], 'blue', 'green'],
            ],
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 14, 0.4],
            'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 10, 1.5, 14, 2, 14.6, 1.3],
          },
          interactive: false,
        },
      ],
    },
    {
      id: 'pano',
      name: 'Panorama-Fotos',
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
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 0.1, 14.5, 3, 15, 3, 17, 5],
            'circle-blur': 0.5,
            'circle-color': [
              'step',
              ['get', 'captured_at'],
              '#F77E5E',
              new Date().setFullYear(new Date().getFullYear() - 4),
              '#FFC01B',
              new Date().setFullYear(new Date().getFullYear() - 2),
              '#05CB63',
            ],
          },
          filter: ['==', ['get', 'is_pano'], true],
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            'line-color': [
              'step',
              ['get', 'captured_at'],
              '#F77E5E',
              new Date().setFullYear(new Date().getFullYear() - 4),
              '#FFC01B',
              new Date().setFullYear(new Date().getFullYear() - 2),
              '#05CB63',
            ],
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 14, 0.4],
            'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 10, 1.5, 14, 2, 14.6, 1.3],
          },
          filter: ['==', ['get', 'is_pano'], true],
          interactive: false,
        },
      ],
    },
  ],
}

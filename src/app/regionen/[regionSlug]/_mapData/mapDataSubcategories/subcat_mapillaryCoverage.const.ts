import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'

const subcatId = 'mapillaryCoverage'
export type SubcatMapillaryCoverageId = typeof subcatId
export type SubcatMapillaryCoverageStyleIds = 'default'

export const subcat_mapillaryCoverage: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Mapillary',
  sourceId: 'mapillary_coverage',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'point',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': 2,
            'circle-blur': 0.5,
            'circle-color': 'green',
          },
          // No dies why this does not work. This was to debug the interactiveFilters
          // filter: [
          //   'all',
          //   ['match', ['get', 'is_pano'], ['false'], true, false],
          // ],
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            'line-color': 'green',
            'line-opacity': 0.7,
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 14, 1],
          },
          interactive: false,
        },
      ],
      // Cannot get this to work. The idea was, to pass an array as string and JSON.parse it in `filterArrayFromMergedDataAndConfig` but first I need to figure out why the manual filter above does not work.
      // interactiveFilters: [
      //   {
      //     id: 'panorama',
      //     name: 'Panorama',
      //     filterConfig: { lookupKey: 'is_pano' },
      //     inputType: 'radiobutton',
      //     options: [
      //       { id: 'true', name: 'Ja' },
      //       { id: 'false', name: 'Nein' },
      //       { id: '[true,false]', name: 'Egal', defaultActive: true },
      //     ],
      //   },
      // ],
    },
  ],
}

import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'
import { defaultLegend } from './subcat_bikelanes.const'

const subcatId = 'bikelanesPresence_legacy'
const source = 'atlas_bikelanesPresence'
const sourceLayer = 'public.bikelanesPresence'
export type SubcatBikelanesPresenceIdLegacy = typeof subcatId
export type SubcatBikelanesPresenceStyleIdsLegacy = 'default'

export const subcat_bikelanesPresence_legacy: MapDataSubcat = {
  id: subcatId,
  name: 'Vollständigkeit Radinfrastruktur (OLD)',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_old_bikelanespresence_complete',
        source,
        sourceLayer,
      }),
      // layers: [
      //   {
      //     id: 'left',
      //     type: 'line',
      //     source: source,
      //     'source-layer': sourceLayer,
      //     layout: {},
      //     paint: {
      //       'line-color': [
      //         'case',
      //         ['match', ['get', 'left'], ['missing'], true, false],
      //         'hsl(312, 92%, 74%)',
      //         ['match', ['get', 'left'], ['missing'], false, true],
      //         'hsl(134, 73%, 20%)',
      //         'hsla(0, 0%, 0%, 0)',
      //       ],
      //       'line-width': ['step', ['zoom'], 2, 14.5, 4],
      //       'line-offset': ['step', ['zoom'], 2, 14.5, 4],
      //     },
      //   },
      //   {
      //     id: 'right',
      //     type: 'line',
      //     source: source,
      //     'source-layer': sourceLayer,
      //     layout: {},
      //     paint: {
      //       'line-color': [
      //         'case',
      //         ['match', ['get', 'right'], ['missing'], true, false],
      //         'hsl(312, 92%, 74%)',
      //         ['match', ['get', 'right'], ['missing'], false, true],
      //         'hsl(134, 73%, 20%)',
      //         'hsla(0, 0%, 0%, 0.7)',
      //       ],
      //       'line-offset': ['step', ['zoom'], -2, 14.5, -4],
      //       'line-width': ['step', ['zoom'], 2, 14.5, 4],
      //     },
      //   },
      //   {
      //     id: 'self',
      //     type: 'line',
      //     source: source,
      //     'source-layer': sourceLayer,
      //     layout: {},
      //     paint: {
      //       'line-color': [
      //         'case',
      //         ['match', ['get', 'self'], ['missing'], true, false],
      //         'hsl(312, 92%, 74%)',
      //         ['match', ['get', 'self'], ['missing'], false, true],
      //         'hsl(134, 73%, 20%)',
      //         'hsla(0, 0%, 0%, 0.7)',
      //       ],
      //       'line-width': ['step', ['zoom'], 2, 14.5, 4],
      //     },
      //   },
      // ],
      legends: [
        ...defaultLegend,
        {
          id: 'missing',
          name: 'Daten fehlen',
          style: {
            type: 'line',
            color: 'hsl(312, 92%, 74%)',
          },
        },
      ],
    },
  ],
}

import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'maxspeed'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatMaxspeedId = typeof subcatId
export type SubcatMaxspeedStyleIds = 'default' | 'details' | 'source'

export const subcat_maxspeed: MapDataSubcat = {
  id: subcatId,
  name: 'Höchstgeschwindigkeit',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Hohe Geschwindigkeiten',
      desc: '', // todo
      layers: mapboxStyleLayers({ group: 'atlas_maxspeed', source, sourceLayer }),
    },
    {
      id: 'details',
      name: 'Details',
      desc: '', // todo
      layers: mapboxStyleLayers({ group: 'atlas_maxspeed_details', source, sourceLayer }),
    },
    // {
    //   id: 'source',
    //   name: 'Quelle',
    //   desc: 'Visualisierung der Datenquellen',
    //   layers: debugLayerStyles({ source, sourceLayer }),
    //       //   legends: [
    //     {
    //       id: 'maxspeedDirect',
    //       name: 'Explizit erfasst `max("maxspeed:forward", "maxspeed:backward", "maxspeed")`',
    //       style: {
    //         type: 'line',
    //         color: 'hsla(232, 99%, 39%, 0.34)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //     {
    //       id: 'maxspeedFromZone',
    //       name: 'Via Zone (maxspeed_type, zone:maxspeed, source:maxspeed)',
    //       style: {
    //         type: 'line',
    //         color: 'hsla(232, 99%, 39%, 0.34)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //     {
    //       id: 'inferred-from-highway',
    //       name: 'Verkehrsberuhigter Bereich',
    //       style: {
    //         type: 'line',
    //         color: 'hsla(232, 99%, 39%, 0.34)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //     {
    //       id: 'infereed-from-landuse',
    //       name: 'Via Wohngebiete',
    //       style: {
    //         type: 'line',
    //         color: 'hsla(232, 99%, 39%, 0.34)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //     {
    //       id: 'nothing-found',
    //       name: 'Unbekannt',
    //       style: {
    //         type: 'line',
    //         color: 'hsla(232, 99%, 39%, 0.34)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //   ],
    // },
  ],
}

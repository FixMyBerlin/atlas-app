import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_bikelanes_default } from './mapboxStyles/groups/atlas_bikelanes_default'
import { mapboxStyleGroupLayers_atlas_bikelanes_details } from './mapboxStyles/groups/atlas_bikelanes_details'
import { mapboxStyleGroupLayers_atlas_bikelanes_widths } from './mapboxStyles/groups/atlas_bikelanes_widths'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes_verified'
export type SubcatBikelanesId = typeof subcatId
export type SubcatBikelanesStyleIds =
  | 'default'
  | 'details'
  | 'width'
  | 'verification'
  | 'completeness'
  | 'freshness'
  | 'bikelane_oneway_arrows'

export const subcat_bikelanes: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Radinfrastruktur',
  ui: 'dropdown',
  sourceId: 'atlas_bikelanes',
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Führungsform einfach',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_default,
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'separated',
          name: 'Führung baul. abgesetzt von Kfz',
          style: {
            type: 'line',
            color: '#174ed9',
          },
        },
        {
          id: 'lane',
          name: 'Führung eigenständig auf Fahrbahn',
          style: {
            type: 'line',
            color: '#0098f0',
          },
        },
        {
          id: 'foot',
          name: 'Führung mit Fußverkehr',
          style: {
            type: 'line',
            color: '#174ed9',
            dasharray: [2.5, 1],
          },
        },
        {
          id: 'mixed',
          name: 'Führung mit Kfz (explizit)',
          style: {
            type: 'line',
            color: '#0098f0',
            dasharray: [2.5, 1],
          },
        },
        {
          id: 'needsClarification',
          name: 'Führungsform unklar',
          style: {
            type: 'line',
            color: '#a97bea',
            dasharray: [2.5, 1],
          },
        },
      ],
    },
    {
      id: 'details',
      name: 'Führungsform details',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_details,
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'footAndCyclewaySegregated',
          name: 'Getrennter Rad- und Gehweg ',
          style: {
            type: 'line',
            color: '#818cf8',
          },
        },
        {
          id: 'cycleway',
          name: 'Getrennter Radweg',
          style: {
            type: 'line',
            color: '#174ed9',
          },
        },
        // {
        //   id: 'todo-pbl',
        //   name: 'Geschuetzter Radfahrstreifen',
        //   style: {
        //     type: 'line',
        //     color: '#2dd4bf',
        //   },
        // },
        {
          id: 'cyclewayOnHighway_exclusive',
          name: 'Radfahrstreifen',
          style: {
            type: 'line',
            color: '#2dd4bf',
          },
        },
        {
          id: 'cyclewayOnHighway',
          name: 'Schutzstreifen',
          style: {
            type: 'line',
            color: '#2dd4bf',
            dasharray: [1, 2.5],
          },
        },
        {
          id: 'crossing',
          name: 'Markierung Kreuzungsbereich',
          style: {
            type: 'line',
            color: '#748b82',
          },
        },
        {
          id: 'footAndCyclewayShared',
          name: 'Gemeinsamer Geh- & Radweg',
          style: {
            type: 'line',
            color: '#ec4899',
          },
        },
        {
          id: 'footwayBicycleYes',
          name: 'Gehweg mit Rad frei',
          style: {
            type: 'line',
            color: '#ec4899',
            dasharray: [2.5, 1],
          },
        },
        {
          id: 'bicycleRoad',
          name: 'Fahrradstraße (keine Kfz)',
          style: {
            type: 'line',
            color: '#fb923c',
          },
        },
        {
          id: 'bicycleRoad_vehicleDestination',
          name: 'Fahrradstraße (Mischverkehr)',
          style: {
            type: 'line',
            color: '#fb923c',
            dasharray: [2.5, 1],
          },
        },
        {
          id: 'livingStreet',
          name: 'Verkehrsberuhigter Bereich',
          style: {
            type: 'line',
            color: '#ec4899',
            dasharray: [1, 2.5],
          },
        },
        {
          id: 'sharedBusLane',
          name: 'Gemeinsamer Fahrstreifen mit Bus',
          style: {
            type: 'line',
            color: '#059669',
          },
        },
        {
          id: 'sharedMotorVehicleLane',
          name: 'Gemeinsamer Fahrstreifen mit Kfz (Markiert)',
          style: {
            type: 'line',
            color: '#059669',
            dasharray: [2.5, 1],
          },
        },
        {
          id: 'needsClarification',
          name: 'Führungsform unklar',
          style: {
            type: 'line',
            color: '#b50382',
            dasharray: [2.5, 1],
          },
        },
      ],
    },
    {
      id: 'width',
      name: 'Breite RVA',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_widths,
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'below1m',
          name: '≤ 1,0 m',
          style: {
            type: 'line',
            color: '#ef9043',
          },
        },
        {
          id: '1to16m',
          name: '1,05–1.6 m',
          style: {
            type: 'line',
            color: '#f6de09',
          },
        },
        {
          id: '165-24m',
          name: '1,65–2.4 m',
          style: {
            type: 'line',
            color: '#a1e217',
          },
        },
        {
          id: 'above24',
          name: '> 2.4 m',
          style: {
            type: 'line',
            color: '#15c65c',
          },
        },
      ],
    },
  ],
}

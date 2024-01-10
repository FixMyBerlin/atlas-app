import { verifiedColor } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Verification/verifiedColor.const'
import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_bikelanes_default } from './mapboxStyles/groups/atlas_bikelanes_default'
import { mapboxStyleGroupLayers_atlas_bikelanes_details } from './mapboxStyles/groups/atlas_bikelanes_details'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes_verified'
export type SubcatBikelanesId = typeof subcatId
export type SubcatBikelanesStyleIds =
  | 'default_legacy'
  | 'default'
  | 'verification'
  | 'completeness'
  | 'freshness'
  | 'bikelane_oneway_arrows'

export const subcat_bikelanes: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Radinfrastruktur',
  sourceId: 'atlas_bikelanes',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default_legacy',
      name: 'Inhalte (Legacy)',
      desc: null,
      layers: legacyMapboxStyleLayers({
        group: 'atlas_bikelanes',
        source,
        sourceLayer,
      }),
      // legends: [...defaultLegend],
    },
    {
      id: 'default',
      name: 'Inhalte',
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
      name: 'Details',
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
        {
          id: 'bicycleRoad',
          name: 'Fahrradstraße (keine Kfz)',
          style: {
            type: 'line',
            color: '#fb923c',
          },
        },
        {
          id: 'cyclewayOnHighway_exclusive',
          name: 'Radfahrstreifen',
          style: {
            type: 'line',
            color: '#2dd4bf',
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
          id: 'cyclewayOnHighway',
          name: 'Schutzstreifen',
          style: {
            type: 'line',
            color: '#2dd4bf',
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
          id: 'footAndCyclewayShared',
          name: 'Gemeinsamer Geh & Radweg',
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
            dasharray: [1, 2.5],
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
          id: 'bicycleRoad_vehicleDestination',
          name: 'Fahrradstraße (Mischverkehr)',
          style: {
            type: 'line',
            color: '#fb923c',
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
      id: 'verification',
      name: 'Inhalte & Prüf-Status (Legacy)',
      desc: null,
      layers: [
        legacyMapboxStyleLayers({
          group: 'atlas_bikelanes_verified',
          source,
          sourceLayer,
        }),
        legacyMapboxStyleLayers({
          group: 'atlas_bikelanes',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'verification-approved',
          name: 'Daten richtig',
          style: {
            type: 'line',
            color: verifiedColor['approved'],
          },
        },
        {
          id: 'verification-rejected',
          name: 'Daten überarbeiten',
          style: {
            type: 'line',
            color: verifiedColor['rejected'],
          },
        },
        {
          id: 'verification-todo',
          name: 'Überprüfung steht aus',
          style: {
            type: 'line',
            color: verifiedColor['undefined'],
          },
        },
      ],
    },
    {
      id: 'completeness',
      name: 'Aufgabe: Führungsform',
      desc: 'Hervorhebung ',
      layers: [
        legacyMapboxStyleLayers({
          group: 'atlas_bikelanes_unspecified',
          source,
          sourceLayer,
        }),
        legacyMapboxStyleLayers({
          group: 'atlas_bikelanes',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'unspecified',
          name: 'Angabe ob Führungs&shy;form straßen&shy;begleitend oder frei geführt unklar',
          style: {
            type: 'line',
            color: '#fa7fe2',
          },
        },
      ],
    },
    {
      id: 'bikelane_oneway_arrows',
      name: 'DEBUG: Einbahnstraßen Pfeile',
      desc: '',
      layers: [
        {
          id: 'oneway-bikelanes',
          source,
          'source-layer': sourceLayer,
          type: 'line',
          paint: {
            'line-width': 15,
            'line-pattern': 'oneway',
            'line-color': 'gray',
          },
          filter: ['has', '_parent_highway'],
        },
      ],
      legends: undefined,
    },
    // {
    //   id: 'freshness',
    //   name: 'Inhalte & Aktualität',
    //   desc: null,
    //   layers: mapboxStyleLayers({
    //     group: 'atlas_bikelanes_fresh',
    //     source,
    //     sourceLayer,
    //   }),
    //       //   legends: [
    //     ...defaultLegend,
    //     {
    //       id: 'fresh_check_date',
    //       name: 'TODO: Aktuell (explizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(107, 88%, 57%)',
    //       },
    //     },
    //     {
    //       id: 'fresh_update_at',
    //       name: 'TODO: Aktuell (implizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(107, 88%, 57%)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //     {
    //       id: 'outdated_check_date',
    //       name: 'TODO: Veraltet (explizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(0, 100%, 41%)',
    //       },
    //     },
    //     {
    //       id: 'outdated_update_at',
    //       name: 'TODO: Veraltet (implizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(0, 100%, 41%)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //   ],
    // },
  ],
}

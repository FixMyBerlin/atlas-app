import TrtoWunschlinienConnectionLines from '@fakeServer/datasets/TrtoWunschlinienConnectionLines.json'
import TrtoWunschlinienCrossingPoints from '@fakeServer/datasets/TrtoWunschlinienCrossingPoints.json'
import TrtoWunschlinienLocationPoints from '@fakeServer/datasets/TrtoWunschlinienLocationPoints.json'
import { MapDataDatasetsSource } from '../types'

export type SourcesDatasetsIds =
  | 'TrtoWunschlinienCrossingPoints'
  | 'TrtoWunschlinienLocationPoints'
  | 'TrtoWunschlinienConnectionLines'

export const sourcesDatasets: MapDataDatasetsSource<SourcesDatasetsIds>[] = [
  {
    regionKey: 'trto',
    id: 'TrtoWunschlinienCrossingPoints',
    name: 'Wunschlinien: Zwangspunkte',
    type: 'geojson',
    data: TrtoWunschlinienCrossingPoints as GeoJSON.FeatureCollection<GeoJSON.Point>,
    attributionHtml: 'FixMyCity',
    layers: [
      {
        id: 'zwangspunkte',
        type: 'circle',
        paint: {
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-color': '#3f74de',
          'circle-radius': 4,
          'circle-stroke-color': '#3f74de',
        },
      },
    ],
  },
  {
    regionKey: 'trto',
    id: 'TrtoWunschlinienLocationPoints',
    name: 'Wunschlinien: Zielpunkte',
    type: 'geojson',
    data: TrtoWunschlinienLocationPoints as GeoJSON.FeatureCollection<GeoJSON.Point>,
    attributionHtml: 'FixMyCity',
    layers: [
      {
        id: 'zielpunkte',
        type: 'circle',
        paint: {
          'circle-radius': ['match', ['get', 'Siedlung'], [1], 8, 4],
          'circle-opacity': 0.1,
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-stroke-color': '#3f74de',
          'circle-color': '#3f74de',
        },
      },
    ],
  },
  {
    regionKey: 'trto',
    id: 'TrtoWunschlinienConnectionLines',
    name: 'Wunschlinien',
    type: 'geojson',
    data: TrtoWunschlinienConnectionLines as GeoJSON.FeatureCollection<GeoJSON.LineString>,
    attributionHtml: 'FixMyCity',
    layers: [
      {
        id: 'wunschlininien',
        type: 'line',
        paint: {
          'line-color': '#3f74de',
          'line-opacity': 0.63,
          'line-width': 2,
        },
      },
    ],
  },
  // {
  //   id: 'TrtoNetzentwurf',
  //   name: 'Wunschlinien: Netzentwurf',
  //   type: 'geojson',
  //   data: TrtoNetzentwurf as GeoJSON.FeatureCollection<GeoJSON.LineString>,
  //   attributionHtml: 'FixMyCity',
  //   layers: [
  //     {
  //       id: 'netzentwurf',
  //       type: 'line',
  //       paint: {
  //         'line-width': 3,
  //         'line-opacity': 0.83,
  //         'line-color': '#dd0303',
  //         'line-dasharray': [2, 0.7],
  //       },
  //     },
  //   ],
  // },
]

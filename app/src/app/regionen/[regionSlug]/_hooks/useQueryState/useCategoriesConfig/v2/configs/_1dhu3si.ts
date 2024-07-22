// DO NOT EDIT MANUALLY
// this file was automatically generated by `saveConfigs.ts`

import { MapDataCategoryParam } from '../../type'

export const _1dhu3si: MapDataCategoryParam[] = [
  {
    id: 'bikelanes',
    active: false,
    subcategories: [
      {
        id: 'bikelanes',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'details', active: false },
          { id: 'width', active: false },
        ],
      },
      { id: 'bikelanes_plus_presence', styles: [{ id: 'default', active: false }] },
      { id: 'bikelanes_plus_width', styles: [{ id: 'default', active: false }] },
      { id: 'bikelanes_plus_surface_smoothness', styles: [{ id: 'default', active: false }] },
      { id: 'bikelanes_plus_signs', styles: [{ id: 'default', active: false }] },
      { id: 'bikelanes_plus_routes', styles: [{ id: 'default', active: false }] },
    ],
  },
  {
    id: 'poi',
    active: false,
    subcategories: [
      {
        id: 'poi',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'education', active: false },
        ],
      },
      {
        id: 'poiPlaces',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'circle', active: false },
        ],
      },
      {
        id: 'poiBoundaries',
        styles: [
          { id: 'hidden', active: true },
          { id: 'default', active: false },
          { id: 'category_district_label', active: false },
          { id: 'category_municipality', active: false },
          { id: 'category_municipality_label', active: false },
        ],
      },
      { id: 'poiPlusBarriers', styles: [{ id: 'default', active: false }] },
      { id: 'poiPlusLanduse', styles: [{ id: 'default', active: false }] },
      { id: 'poiPlusPublicTransport', styles: [{ id: 'default', active: false }] },
    ],
  },
  {
    id: 'roads',
    active: false,
    subcategories: [
      {
        id: 'roads',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'sidestreets', active: false },
          { id: 'mainstreets', active: false },
        ],
      },
      {
        id: 'maxspeed',
        styles: [
          { id: 'hidden', active: true },
          { id: 'default', active: false },
          { id: 'below30', active: false },
          { id: 'above40', active: false },
        ],
      },
      { id: 'roads_plus_oneway', styles: [{ id: 'default', active: false }] },
      { id: 'roads_plus_footways', styles: [{ id: 'default', active: false }] },
    ],
  },
  {
    id: 'surface',
    active: false,
    subcategories: [
      {
        id: 'surfaceRoads',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'bad', active: false },
        ],
      },
      {
        id: 'surfaceBikelanes',
        styles: [
          { id: 'hidden', active: true },
          { id: 'default', active: false },
          { id: 'bad', active: false },
        ],
      },
    ],
  },
  {
    id: 'lit',
    active: false,
    subcategories: [
      {
        id: 'lit',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'lit', active: false },
        ],
      },
      { id: 'lit-completeness', styles: [{ id: 'completeness', active: false }] },
    ],
  },
  {
    id: 'mapillary',
    active: false,
    subcategories: [
      {
        id: 'mapillaryCoverage',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'all', active: false },
          { id: 'age', active: false },
          { id: 'pano', active: false },
        ],
      },
    ],
  },
]
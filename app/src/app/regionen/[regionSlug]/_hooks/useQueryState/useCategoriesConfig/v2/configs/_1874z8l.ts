// DO NOT EDIT MANUALLY
// This file was automatically generated by `saveConfigs.ts`

import { MapDataCategoryParam } from '../../type'

export const _1874z8l: MapDataCategoryParam[] = [
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
          { id: 'classified', active: false },
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
      { id: 'roads_plus_label', styles: [{ id: 'default', active: true }] },
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

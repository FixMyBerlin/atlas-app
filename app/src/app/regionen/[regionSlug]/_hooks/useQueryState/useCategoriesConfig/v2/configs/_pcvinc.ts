// DO NOT EDIT MANUALLY
// this file was automatically generated by `saveConfigs.ts`

import { MapDataCategoryParam } from '../../type'

export const _pcvinc: MapDataCategoryParam[] = [
  {
    id: 'radinfra_bikelanes',
    active: false,
    subcategories: [
      {
        id: 'bikelanes',
        styles: [
          { id: 'hidden', active: false },
          { id: 'default', active: true },
          { id: 'details', active: false },
        ],
      },
      { id: 'bikelanes_plus_routes', styles: [{ id: 'default', active: false }] },
    ],
  },
  {
    id: 'radinfra_surface',
    active: false,
    subcategories: [
      { id: 'bikelanes', styles: [{ id: 'default', active: true }] },
      { id: 'bikelanes_plus_surface_smoothness', styles: [{ id: 'default', active: false }] },
    ],
  },
  {
    id: 'radinfra_width',
    active: false,
    subcategories: [
      { id: 'bikelanes', styles: [{ id: 'default', active: true }] },
      { id: 'bikelanes_plus_width', styles: [{ id: 'default', active: false }] },
    ],
  },
  {
    id: 'radinfra_trafficSigns',
    active: false,
    subcategories: [{ id: 'bikelanes', styles: [{ id: 'default', active: true }] }],
  },
  {
    id: 'radinfra_currentness',
    active: false,
    subcategories: [{ id: 'bikelanes', styles: [{ id: 'default', active: true }] }],
  },
  {
    id: 'radinfra_campagins',
    active: false,
    subcategories: [
      {
        id: 'campaigns',
        styles: [
          { id: 'default', active: true },
          { id: 'adjoiningOrIsolated', active: false },
          { id: 'advisoryOrExclusive', active: false },
          { id: 'missing_access_tag_240', active: false },
          { id: 'missing_access_tag_bicycle_road', active: false },
          { id: 'missing_segregated', active: false },
          { id: 'missing_traffic_sign', active: false },
          { id: 'missing_traffic_sign_244', active: false },
          { id: 'missing_traffic_sign_but_bicycle_designated', active: false },
          { id: 'missing_traffic_sign_but_bicycle_yes', active: false },
          { id: 'missing_traffic_sign_vehicle_destination', active: false },
          { id: 'needsClarification', active: false },
          { id: 'unexpected_bicycle_access_on_footway', active: false },
          { id: 'deprecated_cycleway_shared', active: false },
        ],
      },
    ],
  },
  {
    id: 'radinfra_statistics',
    active: false,
    subcategories: [
      {
        id: 'stats',
        styles: [
          { id: 'default', active: true },
          { id: 'level6', active: false },
        ],
      },
    ],
  },
  {
    id: 'radinfra_mapillary',
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
      { id: 'mapillaryPlus', styles: [{ id: 'highlight', active: false }] },
    ],
  },
]

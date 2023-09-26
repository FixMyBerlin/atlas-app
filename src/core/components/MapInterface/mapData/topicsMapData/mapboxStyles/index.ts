export * from './types'

import style from './mapbox-layer-styles-by-group.json'
import { MapboxStylesByLayerGroupIds } from './types'

type StylesByLayerGroup = { group: MapboxStylesByLayerGroupIds; layers: any }[]

export const mapboxStylesByLayerGroup = style as unknown as StylesByLayerGroup

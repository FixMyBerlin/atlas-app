export * from './types'

import style from './mapbox-layer-styles-by-group.json'
import { MapboxStylesByLayerGroup } from './types'

type StylesByLayerGroup = { group: MapboxStylesByLayerGroup; layers: any }[]

export const mapboxStylesByLayerGroup = style as unknown as StylesByLayerGroup

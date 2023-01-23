// TODO Cleanup once "mapboxStyles" is in place

import style from './atlas-style.const.json'

// Manually created base on the json
export type AtlasStyleGroups =
  | 'barriers'
  | 'landuse'
  | 'maxspeed'
  | 'oberflaechenqualitaet'
  | 'poi'
  | 'radinfra'
  | 'settlements'
  | 'strassentypen'
  | 'surface-bad'

export type AtlasStyle = typeof style

// TODO types on atlasStyle; maybe the easiest for good types is to cleanup the source const to only contina the layers
export const atlasStyle = style

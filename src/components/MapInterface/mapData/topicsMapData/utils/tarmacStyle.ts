// TODO Cleanup once "mapboxStyles" is in place

import style from './tarmac-style.const.json'

// Manually created base on the json
export type TarmacStyleGroups =
  | 'barriers'
  | 'landuse'
  | 'maxspeed'
  | 'oberflaechenqualitaet'
  | 'poi'
  | 'radinfra'
  | 'settlements'
  | 'strassentypen'
  | 'surface-bad'

export type TarmacStyle = typeof style

// TODO types on tarmacStyle; maybe the easiest for good types is to cleanup the source const to only contina the layers
export const tarmacStyle = style

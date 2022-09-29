import { MapDataConfigVisLayer } from '../../types'
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

type _OtherSourceStyles =
  | 'betrachtungsgebiet'
  | 'bibi-problemstellen'
  | 'zes-netzkonzepte'

export type TarmacStyle = typeof style

// TODO types on tarmacStyle; maybe the easiest for good types is to cleanup the source const to only contina the layers
export const tarmacStyle = style

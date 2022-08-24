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

export const tarmacStyle = style

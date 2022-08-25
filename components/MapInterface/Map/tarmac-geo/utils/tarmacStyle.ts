import style from './tarmac-style.const.json'

// Manually created base on the json
export type TarmacStyleGroups =
  | 'fmc-barriers'
  | 'fmc-landuse'
  | 'fmc-maxspeed'
  | 'fmc-oberflaechenqualitaet'
  | 'fmc-poi'
  | 'fmc-radinfra'
  | 'fmc-settlements'
  | 'fmc-strassentypen'
  | 'fmc-surface-bad'

type _OtherSourceStyles =
  | 'fmc-betrachtungsgebiet'
  | 'fmc-bibi-problemstellen'
  | 'fmc-zes-netzkonzepte'

export type TarmacStyle = typeof style

export const tarmacStyle = style

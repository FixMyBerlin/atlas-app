import { StaticRegion } from './regions.const'

export const productName: Map<StaticRegion['product'], string> = new Map([
  ['radverkehr', 'TILDA Radverkehr'],
  ['parkraum', 'TILDA Parkraum'],
  ['fußverkehr', 'TILDA Fußverkehr'],
])

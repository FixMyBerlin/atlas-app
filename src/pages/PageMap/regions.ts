export type Region = {
  name: 'BiBi' | 'TrTo' | 'ZES+'
  path: 'bibi' | 'trto' | 'zes'
}

export const regions = [
  { name: 'BiBi', path: 'bibi' },
  { name: 'TrTo', path: 'trto' },
  { name: 'ZES+', path: 'zes' },
] as const

export const regionFromPath = (regionPath: string) => {
  return regions.find((r) => r.path === regionPath)
}

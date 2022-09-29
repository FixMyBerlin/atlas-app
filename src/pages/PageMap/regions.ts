export type Region = {
  name: string
  path: string
}

export const regions: Region[] = [
  { name: 'BiBi', path: 'bibi' },
  { name: 'TrTo', path: 'trto' },
  { name: 'ZES+', path: 'zes' },
]

export const regionFromPath = (regionPath: string) => {
  return regions.find((r) => r.path === regionPath)
}

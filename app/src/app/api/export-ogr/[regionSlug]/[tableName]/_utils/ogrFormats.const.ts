export const formats = ['geojson', 'gpkg', 'fgb'] as const

export const ogrFormats: Record<(typeof formats)[number], string> = {
  geojson: 'GeoJSON',
  gpkg: 'GPKG',
  fgb: 'FlatGeobuf',
} as const

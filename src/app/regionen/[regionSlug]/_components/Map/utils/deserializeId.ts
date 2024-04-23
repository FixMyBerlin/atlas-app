export const deserializeId = (id: string) => {
  const [osm_type, osm_id] = id.split('/', 2)
  return { osm_type, osm_id: Number(osm_id) } as {
    osm_type: 'node' | 'way' | 'relation'
    osm_id: number
  }
}

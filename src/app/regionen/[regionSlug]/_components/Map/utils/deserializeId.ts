export const deserializeId = (id: string) => {
  const [osm_type, osm_id] = id.split('/')
  return { osm_type: osm_type || '', osm_id: Number(osm_id) }
}

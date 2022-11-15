const osmType = { W: 'way', N: 'node', R: 'relation' }

export const osmUrl = (type: 'W' | 'N' | 'R', id: number) => {
  if (!osmType[type]) return undefined
  return `https://www.openstreetmap.org/${osmType[type]}/${id}`
}

export const historyUrl = (type: 'W' | 'N' | 'R', id: number) => {
  if (!osmType[type]) return undefined
  return `https://osmlab.github.io/osm-deep-history/#/${osmType[type]}/${id}`
}

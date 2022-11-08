const tilesBaseUrl = {
  local: 'http://localhost:7800',
  staging: 'https://staging-tiles.radverkehrsatlas.de',
  production: 'https://tiles.radverkehrsatlas.de',
}

const isProductionBuild = import.meta.env.NODE_ENV === 'production'
const isNetlifyPreviewBuild =
  isProductionBuild && import.meta.env.CONTEXT !== 'production'

export const getCurrentTilesUrl = () => {
  if (import.meta.env.DEV) {
    return tilesBaseUrl.local
  } else if (isNetlifyPreviewBuild || import.meta.env.VITE_STAGING) {
    return tilesBaseUrl.staging
  } else {
    return tilesBaseUrl.production
  }
}

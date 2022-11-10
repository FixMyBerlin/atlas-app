const tilesBaseUrl = {
  development: 'http://localhost:7800',
  staging: 'https://staging-tiles.radverkehrsatlas.de',
  production: 'https://tiles.radverkehrsatlas.de',
}

const isProductionBuild = process.env.NODE_ENV === 'production'
const isNetlifyPreviewBuild =
  isProductionBuild && import.meta.env.CONTEXT !== 'production'

export const getCurrentTilesUrl = () => {
  console.log('netlify debugging getTilesUrl', {
    isProductionBuild,
    isNetlifyPreviewBuild,
    metaEnvContext: import.meta.env.CONTEXT,
    metaEnvNode: process.env.NODE_ENV,
    ViteTilesEnv: import.meta.env.VITE_TILES_ENV,
    ViteTilesEnvRes: tilesBaseUrl[import.meta.env.VITE_TILES_ENV],
    envDev: import.meta.env.DEV,
    result: getCurrentTilesUrl,
  })

  if (import.meta.env.VITE_TILES_ENV) {
    return tilesBaseUrl[import.meta.env.VITE_TILES_ENV]
  }

  if (import.meta.env.DEV) {
    return tilesBaseUrl.development
  } else if (isNetlifyPreviewBuild) {
    return tilesBaseUrl.staging
  } else {
    return tilesBaseUrl.production
  }
}

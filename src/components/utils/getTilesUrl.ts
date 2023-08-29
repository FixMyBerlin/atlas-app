import { isStaging } from './isEnv'

const tilesBaseUrl = {
  development: 'http://localhost:7800',
  staging: 'https://test.radverkehrsatlas.de',
  production: 'https://tiles.radverkehrsatlas.de',
}

export const getTilesUrl = () => {
  // VITE_TILES_ENV is undefined in Netlify (unless we explicity add it)
  if (import.meta.env.VITE_TILES_ENV) {
    return tilesBaseUrl[import.meta.env.VITE_TILES_ENV]
  }

  if (import.meta.env.DEV) {
    return tilesBaseUrl.development
  } else if (isStaging) {
    return tilesBaseUrl.staging
  } else {
    return tilesBaseUrl.production
  }
}

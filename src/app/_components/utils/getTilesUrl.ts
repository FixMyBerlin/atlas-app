import { envKey, isStaging } from './isEnv'

const tilesBaseUrl = {
  development: 'http://localhost:7800',
  staging: 'https://staging-tiles.radverkehrsatlas.de',
  production: 'https://tiles.radverkehrsatlas.de',
}

export const getTilesUrl = () => {
  // NEXT_PUBLIC_TILES_ENV is a helper for local develoment
  if (process.env.NEXT_PUBLIC_TILES_ENV) {
    return tilesBaseUrl[process.env.NEXT_PUBLIC_TILES_ENV]
  }

  return tilesBaseUrl[envKey]
}
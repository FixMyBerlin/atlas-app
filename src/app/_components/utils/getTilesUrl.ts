'use client'

import { isStaging } from './isEnv'

const tilesBaseUrl = {
  development: 'http://localhost:7800',
  staging: 'https://staging-tiles.radverkehrsatlas.de',
  production: 'https://tiles.radverkehrsatlas.de',
}

export const getTilesUrl = () => {
  // NEXT_PUBLIC_TILES_ENV is undefined in Netlify (unless we explicity add it)
  if (process.env.NEXT_PUBLIC_TILES_ENV) {
    return tilesBaseUrl[process.env.NEXT_PUBLIC_TILES_ENV]
  }

  if (process.env.DEV) {
    return tilesBaseUrl.development
  } else if (isStaging) {
    return tilesBaseUrl.staging
  } else {
    return tilesBaseUrl.production
  }
}

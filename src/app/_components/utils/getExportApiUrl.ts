/* eslint-env node */

import { envKeyWithFallback } from './isEnv'

export const exportApiBaseUrl = {
  development: 'http://localhost:80',
  staging: 'https://staging-api.radverkehrsatlas.de',
  production: 'https://api.radverkehrsatlas.de',
}

export const getExportApiUrl = () => {
  // NEXT_PUBLIC_TILES_ENV is a helper for local develoment
  if (process.env.NEXT_PUBLIC_TILES_ENV) {
    return exportApiBaseUrl[process.env.NEXT_PUBLIC_TILES_ENV]
  }

  return exportApiBaseUrl[envKeyWithFallback]
}

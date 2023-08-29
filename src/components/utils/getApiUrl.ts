/* eslint-env node */

import { isStaging } from './isEnv'

export const apiBaseUrl = {
  development: 'http://localhost:80',
  staging: 'https://test-api.radverkehrsatlas.de',
  production: 'https://api.radverkehrsatlas.de',
}

export const getApiUrl = () => {
  // VITE_API_ENV is undefined in Netlify (unless we explicity add it)
  if (import.meta.env.VITE_API_ENV) {
    return apiBaseUrl[import.meta.env.VITE_API_ENV]
  }

  if (import.meta.env.DEV) {
    return apiBaseUrl.development
  } else if (isStaging) {
    return apiBaseUrl.staging
  } else {
    return apiBaseUrl.production
  }
}

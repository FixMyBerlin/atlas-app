/* eslint-env node */

import { isStaging } from './isEnv'

export const apiBaseUrl = {
  development: 'http://localhost:80',
  staging: 'https://staging-api.radverkehrsatlas.de',
  production: 'https://api.radverkehrsatlas.de',
}

export const getApiUrl = () => {
  // NEXT_PUBLIC_API_ENV is undefined in Netlify (unless we explicity add it)
  if (process.env.NEXT_PUBLIC_API_ENV) {
    return apiBaseUrl[process.env.NEXT_PUBLIC_API_ENV]
  }

  if (process.env.DEV) {
    return apiBaseUrl.development
  } else if (isStaging) {
    return apiBaseUrl.staging
  } else {
    return apiBaseUrl.production
  }
}

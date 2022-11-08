/* eslint-env node */

export const apiBaseUrl = {
  local: 'http://localhost:80',
  staging: 'https://staging-api.radverkehrsatlas.de',
  production: 'https://api.radverkehrsatlas.de',
}

const isProductionBuild = import.meta.env.NODE_ENV === 'production'
const isNetlifyPreviewBuild =
  isProductionBuild && import.meta.env.CONTEXT !== 'production'

export const getCurrentApiUrl = () => {
  if (import.meta.env.DEV) {
    return apiBaseUrl.local
  } else if (isNetlifyPreviewBuild || import.meta.env.VITE_STAGING) {
    return apiBaseUrl.staging
  } else {
    return apiBaseUrl.production
  }
}

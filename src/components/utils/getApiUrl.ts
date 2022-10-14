/* eslint-env node */

export const apiBaseUrl = {
  local: 'http://localhost:80',
  staging: 'https://staging.api.radverkehrsatlas.de',
  production: 'https://api.radverkehrsatlas.de',
}

const isProductionBuild = import.meta.env.NODE_ENV === 'production'
const isNetlifyPreviewBuild =
  isProductionBuild && import.meta.env.CONTEXT !== 'production'

export const getCurrentUrl = () => {
  if (
    import.meta.env.GATSBY_BACKEND != null &&
    Object.keys(apiBaseUrl).includes(import.meta.env.GATSBY_BACKEND)
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return apiBaseUrl[import.meta.env.GATSBY_BACKEND]
  }

  if (import.meta.env.DEV) {
    return apiBaseUrl.local
  } else if (isNetlifyPreviewBuild) {
    return apiBaseUrl.staging
  } else {
    return apiBaseUrl.production
  }
}

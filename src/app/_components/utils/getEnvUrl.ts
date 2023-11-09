import { isBrowser } from './isEnv'
import { envKeyWithFallback } from './isEnv'

const envFrontendUrls = {
  development: 'http://127.0.0.1:5173/',
  staging: 'https://stating.radverkehrsatlas.de/',
  production: 'https://radverkehrsatlas.de/',
}

type Environment = keyof typeof envFrontendUrls

export const getEnvUrl = (environment: Environment) => {
  if (!isBrowser || !envKeyWithFallback) return undefined

  const currentEnvUrl = envFrontendUrls[envKeyWithFallback]
  const currentUrl = window.location.href

  return currentUrl.replace(currentEnvUrl, envFrontendUrls[environment])
}

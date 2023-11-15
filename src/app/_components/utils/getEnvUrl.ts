import { isBrowser } from './isEnv'
import { envKeyWithFallback } from './isEnv'

const envFrontendUrls = {
  development: 'http://127.0.0.1:5173/',
  staging: 'https://staging.radverkehrsatlas.de/',
  production: 'https://radverkehrsatlas.de/',
}

type Environment = keyof typeof envFrontendUrls

export const getEnvUrl = (environment: Environment) => {
  if (!isBrowser || !envKeyWithFallback) return undefined

  const currentEnvUrl = envFrontendUrls[envKeyWithFallback]
  const currentUrl = window.location.href
  const newEnvUrl = envFrontendUrls[environment]

  return currentUrl.replace(currentEnvUrl, newEnvUrl)
}

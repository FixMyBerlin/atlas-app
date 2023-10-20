import { isBrowser } from './isDev'
import { envKey } from './isEnv'

const envFrontendUrls = {
  development: 'http://127.0.0.1:5173/',
  staging: 'https://develop--radverkehrsatlas.netlify.app/',
  production: 'https://radverkehrsatlas.de/',
}

type Environment = keyof typeof envFrontendUrls

export const getEnvUrl = (environment: Environment) => {
  if (!isBrowser || !envKey) return undefined

  const currentEnvUrl = envFrontendUrls[envKey]
  const currentUrl = window.location.href

  const newUrl = currentUrl.replace(currentEnvUrl, envFrontendUrls[environment])
  return newUrl
}

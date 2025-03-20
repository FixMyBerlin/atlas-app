import { envKey, isBrowser } from '@/src/app/_components/utils/isEnv'

const envFrontendDomain = {
  development: 'http://127.0.0.1:5173/',
  staging: 'https://staging.tilda-geo.de/',
  production: 'https://tilda-geo.de/',
}

type Environment = keyof typeof envFrontendDomain

export const getAdminInfoEnvUrl = (targetEnv: Environment) => {
  if (!isBrowser) return undefined

  const currentEnvDomain = envFrontendDomain[envKey]
  const targetEnvDomain = envFrontendDomain[targetEnv]
  const currentUrl = window.location.href

  return currentUrl.replace(currentEnvDomain, targetEnvDomain)
}

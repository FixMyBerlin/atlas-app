export const isProd =
  process.env.NODE_ENV === 'production' && process.env.APP_ORIGIN === 'http://radverkehrsatlas.de'

export const isStaging =
  process.env.NODE_ENV === 'production' &&
  process.env.APP_ORIGIN === 'http://staging.radverkehrsatlas.de'

export const isDev = process.env.NODE_ENV === 'development'

export const isBrowser = typeof window !== 'undefined'

export const envKey = isProd
  ? 'production'
  : isStaging
  ? 'staging'
  : isDev
  ? 'development'
  : 'development' // Fallback

export const isProd =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_ENV === 'production'

export const isStaging =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_ENV === 'staging'

export const isDev =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_APP_ENV === 'development'

export const isBrowser = typeof window !== 'undefined'

export const envKey = isProd
  ? 'production'
  : isStaging
    ? 'staging'
    : isDev
      ? 'development'
      : undefined

export const envKeyWithFallback = envKey || 'development' // Fallback

export const isProd =
  process.env.NODE_ENV === 'production' && import.meta.env.production

// `true` for Netlify Staging AND Netlify Branch Previews
export const isStaging =
  process.env.NODE_ENV === 'production' &&
  import.meta.env.CONTEXT !== 'production'

// https://vitejs.dev/guide/env-and-mode.html#env-variables
export const isDev = typeof window !== 'undefined' && import.meta.env.DEV

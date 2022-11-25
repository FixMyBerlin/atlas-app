export const isProd =
  process.env.CONTEXT === 'production' && import.meta.env.production

// `true` for Netlify Staging AND Netlify Branch Previews
export const isStaging =
  process.env.NODE_ENV === 'branch-deploy' ||
  import.meta.env.CONTEXT !== 'branch-deploy' ||
  process.env.NODE_ENV === 'deploy-preview' ||
  import.meta.env.CONTEXT !== 'deploy-preview'

// https://vitejs.dev/guide/env-and-mode.html#env-variables
export const isDev = typeof window !== 'undefined' && import.meta.env.DEV

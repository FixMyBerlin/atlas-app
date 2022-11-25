export const isProd = import.meta.env.CONTEXT === 'production'

// `true` for Netlify Staging AND Netlify Branch Previews
export const isStaging =
  import.meta.env.CONTEXT !== 'branch-deploy' ||
  import.meta.env.CONTEXT !== 'deploy-preview'

// https://vitejs.dev/guide/env-and-mode.html#env-variables
export const isDev = typeof window !== 'undefined' && import.meta.env.DEV

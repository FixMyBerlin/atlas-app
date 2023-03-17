// SSR-Note: Once we re-add some kind of SSR, we need to check for `typeof window !== 'undefined'` again.
//
// `import.meta.env*` is from vite.
// https://vitejs.dev/guide/env-and-mode.html#env-variables
//
// The process.env-parts did not work out in our current setup (process.env.CONTEXT, process.env.NODE_ENV).
// Something to do with how vite works.

export const isProd = import.meta.env.PROD && import.meta.env.VITE_NETLIFY_CONTEXT === 'production'

export const isStaging = import.meta.env.PROD && import.meta.env.VITE_NETLIFY_CONTEXT === 'staging'

// This uses the fallback to .env.DEV in case the .env.local file is not set up.
export const isDev = import.meta.env.DEV || import.meta.env.VITE_NETLIFY_CONTEXT === 'development'

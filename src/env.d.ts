/// <reference types="vite/client" />
// About https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`

  readonly VITE_TILES_ENV: 'staging' | 'production' | 'development'
  readonly VITE_API_ENV: 'staging' | 'production' | 'development'

  /** @desc Custom env variables to select the environment.
   * Specified at https://app.netlify.com/sites/radverkehrsatlas/settings/env
   * Use with `import.meta.env.VITE_NETLIFY_CONTEXT` */
  readonly VITE_NETLIFY_CONTEXT: 'production' | 'staging' | 'development'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

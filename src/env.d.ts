/// <reference types="vite/client" />
// About https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`
  readonly VITE_TILES_ENV: 'staging' | 'production' | 'development'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />
// About https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

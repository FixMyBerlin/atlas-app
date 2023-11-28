interface ImportMetaEnv {
  readonly MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`

  readonly NEXT_PUBLIC_TILES_ENV: 'staging' | 'production' | 'development'
  readonly NEXT_PUBLIC_API_ENV: 'staging' | 'production' | 'development'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

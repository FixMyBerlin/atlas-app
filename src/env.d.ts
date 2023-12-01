namespace NodeJS {
  interface ProcessEnv {
    readonly MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`

    readonly NEXT_PUBLIC_TILES_ENV: 'staging' | 'production' | 'development'

    readonly NEXT_PUBLIC_APP_ORIGIN: string
    readonly NEXT_PUBLIC_APP_ENV: 'staging' | 'production' | 'development'
    readonly SESSION_SECRET_KEY: string

    readonly MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`
    readonly MAPBOX_PARKING_STYLE_ACCESS_TOKEN: `pk.${string}`

    readonly NEXT_PUBLIC_TILES_ENV: 'staging' | 'production' | 'development'

    readonly OSM_CLIENT_ID: string
    readonly OSM_CLIENT_SECRET: string
  }
}

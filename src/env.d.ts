namespace NodeJS {
  interface ProcessEnv {
    // NEXTJS
    readonly NEXT_PUBLIC_APP_ORIGIN: string
    readonly NEXT_PUBLIC_APP_ENV: 'staging' | 'production' | 'development'
    readonly SESSION_SECRET_KEY: string
    // MAP API KEYS

    readonly MAPBOX_STYLE_ACCESS_TOKEN: `pk.${string}`
    readonly MAPBOX_PARKING_STYLE_ACCESS_TOKEN: `pk.${string}`
    // DEVELOPMENT
    readonly NEXT_PUBLIC_TILES_ENV: 'staging' | 'production' | 'development'
    // PRISMA

    readonly DB_HOST: never
    readonly DB_PORT: never
    readonly DB_USER: never
    readonly DB_PASSWORD: never
    readonly DB_DATABASE: never
    readonly DATABASE_URL: never
    // LOGIN
    readonly OSM_CLIENT_ID: string
    readonly OSM_CLIENT_SECRET: string
    // API
    readonly ATLAS_API_KEY: string
    // StaticDatasets
    readonly S3_PMTILES_KEY: string
    readonly S3_PMTILES_SECRET: string
    readonly S3_PMTILES_REGION: 'eu-central-1'
    readonly API_ROOT_URL:
      | 'http://127.0.0.1:5173/api'
      | 'https://staging.radverkehrsatlas.de/api'
      | 'https://radverkehrsatlas.de/api'
    readonly S3_PMTILES_BUCKET: string
    readonly S3_PMTILES_FOLDER: production | staging | localdev
  }
}

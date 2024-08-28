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

    readonly PGUSER: never
    readonly PGDATABASE: never
    readonly PGPASSWORD: never
    readonly DATABASE_URL: string
    // LOGIN
    readonly OSM_CLIENT_ID: string
    readonly OSM_CLIENT_SECRET: string
    readonly NEXT_PUBLIC_OSM_API_URL:
      | 'https://api.openstreetmap.org/api/0.6'
      | 'https://master.apis.dev.openstreetmap.org/api/0.6'
    // API
    readonly ATLAS_API_KEY: string
    // StaticDatasets
    readonly S3_KEY: string
    readonly S3_SECRET: string
    readonly S3_REGION: 'eu-central-1'
    readonly API_ROOT_URL:
      | 'http://127.0.0.1:5173/api'
      | 'https://staging.radverkehrsatlas.de/api'
      | 'https://radverkehrsatlas.de/api'
    readonly S3_BUCKET: string
    readonly S3_UPLOAD_FOLDER: production | staging | localdev
    readonly NEXT_PUBLIC_DO_NOT_NAVIGATE: string
  }
}

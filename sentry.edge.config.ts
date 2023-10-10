// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { envKey, isDev } from 'src/app/_components/utils/isEnv'

Sentry.init({
  enabled: !isDev,
  environment: envKey,

  dsn: 'https://6c4fd261ed854a0e93cf3df248b94c08@o1174824.ingest.sentry.io/4504378162937856',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: isDev,
})

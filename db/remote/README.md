# About

Helper script to pull the production database for local development. Handles anonmization.

# Steps

1. Add `DATABASE_URL_PRODUCTION` to [`.env.local`](../../.env.local)
2. `npm run db:getDump`
3. `npm run db:restoreDump`

import { PrismaClient } from '@prisma/client'

// This is the client for accessing the geo data.
// It allows direct SQL queries to the database, so it should be used cautiously as it bypasses Prisma's integrated security checks.

const url = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/\?schema.*/, '') : ''
export const geoDataClient = new PrismaClient({
  datasources: {
    db: {
      url,
    },
  },
})

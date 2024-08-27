import { PrismaClient } from '@prisma/client'

// This is the client for accessing the geo data.
// It allows direct SQL queries to the database, so it should be used cautiously as it bypasses Prisma's integrated security checks.
export const geoDataClient = new PrismaClient({
  datasourceUrl: (process.env.DATABASE_URL as string).replace(/\?schema.*/, ''),
})

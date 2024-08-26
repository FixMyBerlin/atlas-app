import { PrismaClient } from '@prisma/client'

// This is experimental. It is used in /regionen/slug/stats (page RSC).
// The idea is to use it with prismaClientForRawQueries.$queryRaw``
// But only in situations where permissions are already handled by Blitz.
export const geoDataClient = new PrismaClient({
  datasourceUrl: (process.env.DATABASE_URL as string).replace('schema=prisma', 'schema=public'),
})

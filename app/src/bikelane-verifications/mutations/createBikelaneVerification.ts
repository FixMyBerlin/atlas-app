import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { z } from 'zod'
import { CreateVerificationSchema, VerificationSchema } from '../schemas'

const Schema = CreateVerificationSchema.merge(z.object({ regionSlug: z.string() }))

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ regionSlug: _, ...input }) => {
    const result = await db.bikelaneVerification.create({
      data: {
        ...input,
        // The DB stores osm_id and verified_by as BigInt to be consistent with osm2pgsql.
        // But we get Error 500 TypeError "Do not know how to serialize a BigInt" if we use BigInt here.
        // Luckily we don't need to, because Postgres transforms the input just fine.
        osm_id: input.osm_id,
        verified_by: input.verified_by,
      },
    })
    // Transforms bigInt to number
    const transformed = VerificationSchema.parse(result)
    return transformed
  },
)

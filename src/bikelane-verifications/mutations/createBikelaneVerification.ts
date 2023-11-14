import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { CreateVerificationSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(CreateVerificationSchema),
  // resolver.authorize(), // TODO MIGRATION AUTH
  async (input) => {
    return await db.bikelaneVerification.create({
      data: {
        ...input,
        // The DB stores osm_id and verified_by as BigInt to be consistent with osm2pgsql.
        // But we get Error 500 TypeError "Do not know how to serialize a BigInt" if we use BigInt here.
        // Luckily we don't need to, because Postgres transforms the input just fine.
        osm_id: input.osm_id,
        verified_by: input.verified_by,
      },
    })
  },
)

import { resolver } from '@blitzjs/rpc'
import { AuthenticationError, Ctx } from 'blitz'
import db from 'db'
import { CreateVerificationSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(CreateVerificationSchema),
  // resolver.authorize(), // TODO MIGRATION AUTH
  async (input) => {
    return await db.bikelaneVerification.create({
      data: {
        ...input,
        // We store BigInt in the database to be consistent with osm2pgsql.
        // But we need regular numbers in the UI since JS does not handle BigInt well
        // (eg. JSON.stringify fails with BigInts present).
        osm_id: BigInt(input.osm_id),
        verified_by: BigInt(input.verified_by),
      },
    })
  },
)

import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { VerificationSchema } from '../schemas'

const createBikelaneVerificationSchema = VerificationSchema.omit({
  id: true,
  verified_at: true, // set by the DB automatically
})

export default resolver.pipe(
  resolver.zod(createBikelaneVerificationSchema),
  // resolver.authorize(), // TODO MIGRATION
  async (input) => {
    const bikelaneVerification = await db.bikelaneVerification.create({
      data: input,
    })

    return bikelaneVerification
  },
)

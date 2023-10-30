import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { CreateVerificationSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(CreateVerificationSchema),
  // resolver.authorize(), // TODO MIGRATION AUTH
  async (input) =>
    await db.bikelaneVerification.create({
      data: input,
    }),
)

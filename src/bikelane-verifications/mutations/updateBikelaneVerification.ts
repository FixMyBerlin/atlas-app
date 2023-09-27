import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { VerificationSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(VerificationSchema),
  resolver.authorize('ADMIN'),
  async ({ id, ...data }) => {
    const bikelaneVerification = await db.bikelaneVerification.update({
      where: { id },
      data,
    })

    return bikelaneVerification
  },
)

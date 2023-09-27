import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { z } from 'zod'

const DeleteBikelaneVerificationSchema = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteBikelaneVerificationSchema),
  resolver.authorize('ADMIN'),
  async ({ id }) => {
    const bikelaneVerification = await db.bikelaneVerification.deleteMany({
      where: { id },
    })

    return bikelaneVerification
  },
)

import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { z } from 'zod'
import { VerificationSchema } from '../schemas'

const GetBikelaneVerification = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetBikelaneVerification),
  // resolver.authorize(), // TODO MIGRATION AUTH
  async ({ id }) => {
    const bikelaneVerification = await db.bikelaneVerification.findFirst({
      where: { id },
    })

    if (!bikelaneVerification) throw new NotFoundError()

    // Transforms bigInt to number
    return VerificationSchema.parse(bikelaneVerification)
  },
)

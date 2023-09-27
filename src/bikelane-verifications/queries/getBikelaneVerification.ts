import { NotFoundError } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { z } from 'zod'

const GetBikelaneVerification = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetBikelaneVerification),
  // resolver.authorize(), // TODO MIGRATION
  async ({ id }) => {
    const bikelaneVerification = await db.bikelaneVerification.findFirst({
      where: { id },
    })

    if (!bikelaneVerification) throw new NotFoundError()

    return bikelaneVerification
  },
)

import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeProjectAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { z } from 'zod'
import { VerificationSchema } from '../schemas'

const GetBikelaneVerification = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetBikelaneVerification),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ id }) => {
    const bikelaneVerification = await db.bikelaneVerification.findFirst({
      where: { id },
    })

    if (!bikelaneVerification) throw new NotFoundError()

    // Transforms bigInt to number
    return VerificationSchema.parse(bikelaneVerification)
  },
)

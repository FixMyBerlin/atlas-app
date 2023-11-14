import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeProjectAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { z } from 'zod'
import { VerificationSchema } from '../schemas'
import getBikelaneVerification from './getBikelaneVerification'

const GetBikelaneVerification = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
  regionSlug: z.string(),
})

export type TVerification = Awaited<ReturnType<typeof getBikelaneVerification>>

export default resolver.pipe(
  resolver.zod(GetBikelaneVerification),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ regionSlug: _, id }) => {
    const bikelaneVerification = await db.bikelaneVerification.findFirst({
      where: { id },
    })

    if (!bikelaneVerification) throw new NotFoundError()

    // Transforms bigInt to number
    return VerificationSchema.parse(bikelaneVerification)
  },
)

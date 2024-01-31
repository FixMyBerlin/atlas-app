import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
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
    const result = await db.bikelaneVerification.findFirst({
      where: { id },
    })

    if (!result) throw new NotFoundError()

    // Transforms bigInt to number
    const transformed = VerificationSchema.parse(result)
    return transformed
  },
)

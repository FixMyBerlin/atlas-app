import db from '@/db'
import { authorizeRegionAdmin } from '@/src/server/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from '@/src/server/regions/queries/getRegionIdBySlug'
import { resolver } from '@blitzjs/rpc'
import { AuthorizationError } from 'blitz'
import { z } from 'zod'
import { CreateNoteSchema } from '../schemas'

const Schema = CreateNoteSchema.merge(z.object({ regionSlug: z.string() }))

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ regionSlug, ...input }, ctx) => {
    const { session } = ctx

    if (!session.userId) {
      throw new AuthorizationError()
    }

    const regionId = await getRegionIdBySlug(regionSlug)

    const result = await db.note.create({
      data: { ...input, regionId, userId: session.userId },
    })
    return result
  },
)

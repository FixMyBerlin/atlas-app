import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { UpdateUploadSchema } from '../schema'

export default resolver.pipe(
  resolver.zod(UpdateUploadSchema),
  resolver.authorize('ADMIN'),
  async ({ id, regions, ...input }) => {
    await db.upload.update({
      where: { id },
      data: { regions: { set: [] } },
    })
    return await db.upload.update({
      where: { id },
      data: {
        ...input,
        regions: { connect: regions.map((id) => ({ id })) }
      },
    })
  },
)

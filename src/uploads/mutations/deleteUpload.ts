import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { DeleteUploadSchema } from '../schema'

export default resolver.pipe(
  resolver.zod(DeleteUploadSchema),
  resolver.authorize('ADMIN'),
  async ({ id }) => await db.upload.deleteMany({ where: { id } }),
)

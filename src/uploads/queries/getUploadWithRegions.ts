import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { GetUploadSchema } from '../schema'

export default resolver.pipe(resolver.zod(GetUploadSchema), async ({ slug }) => {
  return await db.upload.findFirstOrThrow({
    where: { slug },
    include: { regions: { select: { id: true } } },
  })
})

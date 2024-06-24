import {NotFoundError} from "blitz"
import { resolver } from "@blitzjs/rpc"
import db  from "db"
import {z} from "zod"

const GetNoteComment = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetNoteComment),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const noteComment = await db.noteComment.findFirst({where: {id}})

    if (!noteComment) throw new NotFoundError()

    return noteComment
  }
)
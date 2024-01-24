import db from 'db'
import { checkApiKey } from '../util'

export async function GET(request: Request) {
  const check = checkApiKey(request)
  if (!check.ok) return check.errorResponse

  return Response.json(await db.region.findMany())
}

import db from 'db'
import { AuthorizationError } from 'blitz'

type Input = string | Record<string, any>

export default async function getRegionIdBySlug(input: Input) {
  let regionSlug: null | string = null
  if (typeof input === 'string') {
    regionSlug = input
  } else if ('regionSlug' in input) {
    regionSlug = input.regionSlug
  } else if ('slug' in input) {
    regionSlug = input.slug
  }

  if (regionSlug === null) {
    throw new AuthorizationError()
  }

  const region = await db.region.findFirstOrThrow({
    where: { slug: regionSlug },
    select: { id: true },
  })

  return region.id
}

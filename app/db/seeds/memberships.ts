import { Prisma } from '@prisma/client'
import db from '../index'
import { generateUserEmail } from './users'

type Memberships = Prisma.MembershipUncheckedCreateInput[]

const seedMemberships = async () => {
  const regions = await db.region.findMany()
  const users = await db.user.findMany()
  const usersByEmail = Object.fromEntries(users.map((user) => [user.email, user]))

  const regionMemberships: Memberships = regions.map(({ id, slug }) => ({
    regionId: id,
    userId: usersByEmail[generateUserEmail(slug)].id,
  }))

  const allRegionsAdminId = usersByEmail['all-regions@example.com'].id
  const allMemberships: Memberships = regions.map(({ id }) => ({
    regionId: id,
    userId: allRegionsAdminId,
  }))

  const memberships = [...regionMemberships, ...allMemberships]

  for (const data of memberships) {
    if (data) {
      await db.membership.create({ data })
    }
  }
}

export default seedMemberships

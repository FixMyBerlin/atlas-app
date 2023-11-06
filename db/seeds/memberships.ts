import { Prisma } from "@prisma/client"
import db from "../index"
import { generateUserEmail } from "./users"

type Memberships = Prisma.MembershipUncheckedCreateInput[]

const seedMemberships = async () => {
  const regions = await db.region.findMany()
  const users = await db.user.findMany()
  const usersByEmail = Object.fromEntries(users.map((user) => [user.email, user]))

  let regionMemberships: Memberships = regions.map(({ id, slug }) => ({
    regionId: id,
    // @ts-ignore
    userId: usersByEmail[generateUserEmail(slug)].id,
  }))

  // @ts-ignore
  const allRegionsAdminId = usersByEmail["all-regions@fixmycity.de"].id
  let allMemberships: Memberships = regions.map(({ id }) => ({
    regionId: id,
    // @ts-ignore
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

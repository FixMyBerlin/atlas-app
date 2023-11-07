import db from '../index'
import { Prisma } from '@prisma/client'

type Users = Prisma.UserUncheckedCreateInput[]

export const generateUserEmail = (slug: string) => `${slug}@example.com`

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

let osmId = 1000

const seedUsers = async () => {
  const allRegions = await db.region.findMany()
  // password: dev-team@fixmycity.de
  const hashedPassword =
    'JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJDRMWm82dmVrRk91VnVlZTVwcEpiS3ckOHFZcHhyM2RITm0yTGxTeXdqeEcxSWFsZEJCUWhxNVZxdm53eHoxTk4xTQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='

  const genericUsers: Users = [
    {
      osmId: osmId++,
      email: 'admin@example.com',
      role: 'ADMIN',
      name: 'Admin',
      phone: '030 549 086 65 - 90',
      hashedPassword,
    },
    {
      osmId: osmId++,
      email: 'all-regions@example.com',
      role: 'USER',
      name: 'All-Regions',
      phone: '030 549 086 65 - 91',
      hashedPassword,
    },
    {
      osmId: osmId++,
      email: 'no-region@example.com',
      role: 'USER',
      name: 'No-Region',
      phone: '030 549 086 65 - 92',
      hashedPassword,
    },
  ]

  const regionAdmins: Users = allRegions.map(({ id, slug }) => ({
    osmId: osmId++,
    email: generateUserEmail(slug),
    role: 'USER',
    name: `${capitalize(slug)}-Admin`,
    phone: `030 549 086 65 - ${id}`,
    hashedPassword,
  }))

  const fmcAdmins: Users = [
    {
      osmId: 11881,
      email: 'tobias@fixmycity.de',
      role: 'ADMIN',
      name: `Tobias`,
      phone: undefined,
      hashedPassword,
    },
  ]

  const users = [...genericUsers, ...regionAdmins, ...fmcAdmins]
  for (const user of users) {
    await db.user.create({ data: user })
  }
}

export default seedUsers

import db from '../index'
import { Prisma } from '@prisma/client'

type Users = Prisma.UserUncheckedCreateInput[]

const seedUsers = async () => {
  // password: dev-team@fixmycity.de
  const hashedPassword =
    'JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJDRMWm82dmVrRk91VnVlZTVwcEpiS3ckOHFZcHhyM2RITm0yTGxTeXdqeEcxSWFsZEJCUWhxNVZxdm53eHoxTk4xTQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='

  const users: Users = [
    {
      email: 'admin@fixmycity.de',
      role: 'ADMIN',
      firstName: "Admin",
      lastName: "Admin",
      hashedPassword,
    },
    {
      email: 'user@fixmycity.de',
      role: 'USER',
      firstName: "User",
      lastName: "User",
      hashedPassword,
    },
  ]
  for (let i = 0; i < users.length; i++) {
    // @ts-ignore
    await db.user.create({ data: users[i] })
  }
}

export default seedUsers

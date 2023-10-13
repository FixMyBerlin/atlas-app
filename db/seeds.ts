import seedBikelaneVerification from './seeds/bikelaneVerification'
import seedRegions from './seeds/regions'
import seedUsers from './seeds/users'

/*
 * This seed function is executed when you run `blitz db seed`.
 */
const seed = async () => {
  await seedRegions()
  await seedBikelaneVerification()
  await seedUsers()
}

export default seed

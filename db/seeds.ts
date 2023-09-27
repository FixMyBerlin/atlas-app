import seedBikelaneVerification from './seeds/bikelaneVerification'
import seedRegions from './seeds/regions'

/*
 * This seed function is executed when you run `blitz db seed`.
 */
const seed = async () => {
  await seedRegions()
  await seedBikelaneVerification()
}

export default seed

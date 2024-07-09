import seedBikelaneVerification from './seeds/bikelaneVerification'
import seedRegions from './seeds/regions'
import seedUsers from './seeds/users'
import seedMemberships from './seeds/memberships'
import seedUploads from './seeds/pmtiles'
import seedAtlasNotes from './seeds/atlasNotes'

/*
 * This seed function is executed when you run `blitz db seed`.
 */
const seed = async () => {
  await seedRegions()
  await seedBikelaneVerification()
  await seedUsers()
  await seedMemberships()
  await seedUploads()
  await seedAtlasNotes()
}

export default seed

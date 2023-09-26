import seedRegions from './seeds/regions'

/*
 * This seed function is executed when you run `blitz db seed`.
 */
const seed = async () => {
  await seedRegions()
}

export default seed

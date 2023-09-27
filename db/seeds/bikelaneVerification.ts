import { VerificationSchema } from 'src/bikelane-verifications/schemas'
import { z } from 'zod'
import db from '../index'

const Schema = VerificationSchema.omit({ id: true, verified_at: true })

const seedBikelaneVerification = async () => {
  const seedBikelaneVerification: z.infer<typeof Schema>[] = [
    {
      osm_type: 'W',
      // Weigantufer https://www.openstreetmap.org/way/859427215
      // Location 18/52.48408/13.44557
      osm_id: BigInt(859427215),
      verified_by: BigInt(11881), // tordans
      verified: 'approved',
      comment: undefined,
    },
    {
      osm_type: 'W',
      osm_id: BigInt(859427215),
      verified_by: BigInt(11881), // tordans
      verified: 'rejected',
      comment: `Korrektur:

      Breite überprüft, ist **4m**`,
    },
    {
      osm_type: 'W',
      osm_id: BigInt(859427215),
      verified_by: BigInt(7302664), // hejco
      verified: 'approved',
      comment: 'Danke, Breite ist jetzt korrigiert',
    },
  ]

  for (let i = 0; i < seedBikelaneVerification.length; i++) {
    const data = seedBikelaneVerification[i]
    if (data) {
      await db.bikelaneVerification.create({ data })
    }
  }
}

export default seedBikelaneVerification

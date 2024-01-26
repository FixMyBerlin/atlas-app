import db from '../index'
import { Prisma } from '@prisma/client'

const seedUploads = async () => {
  const seedUploads: Prisma.UploadUncheckedCreateInput[] = [
    {
      slug: 'nudafa-combined',
      externalUrl:
        'https://atlas-private.s3.eu-central-1.amazonaws.com/test-data/nudafa-combined.pmtiles',
    },
  ]

  const region = await db.region.findFirstOrThrow({ where: { slug: 'nudafa' } })
  for (const data of seedUploads) {
    if (data) {
      await db.upload.create({
        data: {
          ...data,
          regions: { connect: { id: region.id } },
        },
      })
    }
  }
}

export default seedUploads

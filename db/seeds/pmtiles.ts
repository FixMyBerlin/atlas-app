import db from '../index'
import { Prisma } from '@prisma/client'

const seedUploads = async () => {
  const seedUploads: Prisma.UploadUncheckedCreateInput[] = [
    {
      regionId: 7,
      slug: 'nudafa-combined',
      externalUrl: 'https://atlas-private.s3.eu-central-1.amazonaws.com/pmtiles/nudafa-combined.pmtiles',
    },
  ]

  for (const data of seedUploads) {
    if (data) {
      await db.upload.create({ data })
    }
  }
}

export default seedUploads

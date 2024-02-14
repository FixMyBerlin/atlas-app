import { Prisma } from '@prisma/client'
import { defaultLineLayerStyles } from 'scripts/StaticDatasets/utils/defaultLayerStyles'
import db from '../index'

const seedUploads = async () => {
  const seedUploads: Prisma.UploadUncheckedCreateInput[] = [
    {
      slug: 'nudafa-combined',
      pmtilesUrl:
        'https://atlas-private.s3.eu-central-1.amazonaws.com/test-data/nudafa-combined.pmtiles',
      configs: [
        {
          name: 'Zielnetz Stand 22.11.2023',
          subId: 'zielnetz',
          type: 'vector',
          attributionHtml: '',
          inspector: {
            enabled: true,
            highlightingKey: 'TODO',
            documentedKeys: false,
            disableTranslations: true,
          },
          layers: defaultLineLayerStyles({
            filter: ['match', ['get', 'Typ'], ['Zielnetz'], true, false],
          }),
        },
      ],
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

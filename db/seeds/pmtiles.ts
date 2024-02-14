import { Prisma } from '@prisma/client'
import { defaultLineLayerStyles } from 'scripts/StaticDatasets/geojson/_utils/defaultLayerStyles'
import db from '../index'

const seedUploads = async () => {
  const seedUploadsNudafa: Prisma.UploadUncheckedCreateInput[] = [
    {
      slug: 'nudafa-combined',
      pmtilesUrl:
        'https://atlas-private.s3.eu-central-1.amazonaws.com/test-data/nudafa-combined.pmtiles',
      configs: [
        {
          name: 'Zielnetz Stand 22.11.2023',
          category: null,
          attributionHtml: '',
          type: 'vector',
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

  const seedUploadsBibi: Prisma.UploadUncheckedCreateInput[] = [
    {
      slug: 'two-configs',
      pmtilesUrl:
        'https://atlas-private.s3.eu-central-1.amazonaws.com/test-data/nudafa-combined.pmtiles',
      configs: [
        {
          name: 'two-configs config 1',
          subId: 'config1',
          attributionHtml: 'Lorem Ipsum',
          type: 'vector',
          inspector: {
            enabled: true,
            highlightingKey: 'TODO',
            documentedKeys: false,
            disableTranslations: true,
          },
          layers: defaultLineLayerStyles({}),
        },
        {
          name: 'two configs, config 2',
          subId: 'config2',
          type: 'vector',
          attributionHtml: 'Lorem Ipsum',
          inspector: {
            enabled: true,
            highlightingKey: 'TODO',
            documentedKeys: false,
            disableTranslations: true,
          },
          layers: defaultLineLayerStyles({}),
        },
      ],
    },
  ]

  const regionNudafa = await db.region.findFirstOrThrow({ where: { slug: 'nudafa' } })
  for (const data of seedUploadsNudafa) {
    await db.upload.create({
      data: {
        ...data,
        regions: { connect: { id: regionNudafa.id } },
      },
    })
  }

  const regionBibi = await db.region.findFirstOrThrow({ where: { slug: 'bibi' } })
  for (const data of seedUploadsBibi) {
    await db.upload.create({
      data: {
        ...data,
        regions: { connect: { id: regionBibi.id } },
      },
    })
  }
}

export default seedUploads

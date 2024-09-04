import { Prisma } from '@prisma/client'
import db from '../index'

const lineLayer = {
  id: 'nudafa-combined-line',
  type: 'line',
  paint: {
    'line-width': ['coalesce', ['get', 'felt:strokeWidth'], ['get', 'stroke-width'], 10],
    'line-color': ['to-color', ['get', 'felt:color'], ['get', 'stroke'], '#14b8a6'],
    'line-opacity': ['coalesce', ['get', 'felt:strokeOpacity'], ['get', 'stroke-opacity'], 0.6],
  },
  filter: ['match', ['get', 'Typ'], ['Zielnetz'], true, false],
}

const seedUploads = async () => {
  const seedUploadsNudafa: Prisma.UploadUncheckedCreateInput[] = [
    {
      slug: 'nudafa-combined',
      url:
        'https://atlas-private.s3.eu-central-1.amazonaws.com/test-data/nudafa-combined.pmtiles',
      configs: [
        {
          name: 'Zielnetz Stand 22.11.2023',
          category: null,
          attributionHtml: '',
          type: 'vector',
          inspector: {
            enabled: true,
            documentedKeys: false,
            disableTranslations: true,
          },
          layers: [lineLayer],
        },
      ],
    },
  ]

  const seedUploadsBibi: Prisma.UploadUncheckedCreateInput[] = [
    {
      slug: 'two-configs',
      url:
        'https://atlas-private.s3.eu-central-1.amazonaws.com/test-data/nudafa-combined.pmtiles',
      configs: [
        {
          name: 'two-configs config 1',
          subId: 'config1',
          attributionHtml: 'Lorem Ipsum',
          type: 'vector',
          inspector: {
            enabled: true,
            documentedKeys: false,
            disableTranslations: true,
          },
          layers: [lineLayer],
        },
        {
          name: 'two configs, config 2',
          subId: 'config2',
          type: 'vector',
          attributionHtml: 'Lorem Ipsum',
          inspector: {
            enabled: true,
            documentedKeys: false,
            disableTranslations: true,
          },
          layers: [lineLayer],
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

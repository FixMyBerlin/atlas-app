import db, { Region } from '../index'

const seedRegions = async () => {
  const seedRegions: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      slug: 'bibi',
      shortName: 'BiBi',
      name: 'Bietigheim-Bissingen',
      public: true,
    },
    {
      slug: 'trto',
      shortName: 'TrTo',
      name: 'Treptower Tollensewinkel',
      public: true,
    },
    {
      slug: 'berlin',
      shortName: 'Berlin',
      name: 'Berlin',
      public: false,
    },
    {
      slug: 'nudafa',
      shortName: 'NUDAFA',
      name: 'NUDAFA',
      public: false,
    },
    {
      slug: 'parkraum',
      shortName: 'Parkraum',
      name: 'Parkraumanalyse',
      public: true,
    },
    {
      slug: 'rs8',
      shortName: 'RS 8',
      name: 'Trassenscout RS 8',
      public: false,
    },
    {
      slug: 'woldegk',
      shortName: 'Woldegk',
      name: 'Amt Woldegk',
      public: true,
    },
    {
      slug: 'deutschland',
      shortName: 'Download',
      name: 'Deutschlandweiter Download',
      public: false,
    },
  ]

  for (const data of seedRegions) {
    if (data) {
      await db.region.create({ data })
    }
  }
}

export default seedRegions

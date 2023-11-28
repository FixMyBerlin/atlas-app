import db, { Region } from '../index'

const seedRegions = async () => {
  const seedRegions: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      slug: 'bibi',
      public: true,
    },
    {
      slug: 'trto',
      public: true,
    },
    {
      slug: 'berlin',
      public: false,
    },
    {
      slug: 'nudafa',
      public: false,
    },
    {
      slug: 'parkraum',
      public: true,
    },
    {
      slug: 'rs8',
      public: false,
    },
    {
      slug: 'woldegk',
      public: true,
    },
    {
      slug: 'deutschland',
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

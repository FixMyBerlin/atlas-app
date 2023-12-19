import db, { Region } from '../index'

const seedRegions = async () => {
  const seedRegions: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      slug: 'bibi',
      public: true,
      exportPublic: true,
    },
    {
      slug: 'trto',
      public: true,
      exportPublic: true,
    },
    {
      slug: 'berlin',
      public: false,
      exportPublic: false,
    },
    {
      slug: 'nudafa',
      public: false,
      exportPublic: false,
    },
    {
      slug: 'parkraum',
      public: true,
      exportPublic: true,
    },
    {
      slug: 'rs8',
      public: false,
      exportPublic: false,
    },
    {
      slug: 'woldegk',
      public: true,
      exportPublic: false,
    },
    {
      slug: 'deutschland',
      public: false,
      exportPublic: false,
    },
  ]

  for (const data of seedRegions) {
    if (data) {
      await db.region.create({ data })
    }
  }
}

export default seedRegions

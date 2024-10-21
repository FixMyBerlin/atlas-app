// specify license and attribution for data export
// const license = "'ODbL 1.0, https://opendatacommons.org/licenses/odbl/'"
// const attribution = "'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de'"

import { geoDataClient } from '../prisma-client'

export async function runAnalysis() {
  await geoDataClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS "bikelaneCategoryLengths"
    (
      id TEXT UNIQUE,
      name TEXT,
      category_length JSONB
    );
    `
  geoDataClient.$executeRaw`
    INSERT INTO "bikelaneCategoryLengths" (id, name, category_length)
    SELECT id, tags->>'name', atlas_count_category_lengths(geom)
      FROM "boundaries"
      WHERE (tags->>'admin_level')::TEXT = '4'
      ON CONFLICT (id)
      DO UPDATE SET category_length = EXCLUDED.category_length;
  `
}

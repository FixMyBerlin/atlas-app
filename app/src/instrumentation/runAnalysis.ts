// specify license and attribution for data export
// const license = "'ODbL 1.0, https://opendatacommons.org/licenses/odbl/'"
// const attribution = "'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de'"

import { geoDataClient } from '../prisma-client'

export async function runAnalysis() {
  geoDataClient.$executeRaw`DROP TABLE IF EXISTS "boundaryStats";`
  geoDataClient.$executeRaw`
  SELECT id, tags->'name', count_category_lengths(geom)
    FROM (SELECT * FROM "boundaries" WHERE (tags->>'admin_level')::TEXT = '4') sq;`
}

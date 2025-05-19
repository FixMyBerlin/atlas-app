import { $, sql } from 'bun'

export async function initializeSchemaData() {
  await sql`CREATE SCHEMA IF NOT EXISTS data`
  return true
}

export async function initializeCustomFunctionsDataTables() {
  await $`psql -q -f ./dataTables/copy_mapillary_coverage_tags.sql`
  return true
}

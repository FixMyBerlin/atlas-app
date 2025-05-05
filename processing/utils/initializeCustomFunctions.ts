import { $ } from 'bun'

export async function initializeCustomFunctions() {
  await $`psql -q -f ./custom_functions/jsonb_diff.sql`
  await $`psql -q -f ./custom_functions/copy_mapillary_coverage_tags.sql`
  return true
}

import { $ } from 'bun'

export async function initializeCustomFunctions() {
  return [
    $`psql -q -f ../custom_functions/jsonb_diff.sql`,
  ]
}

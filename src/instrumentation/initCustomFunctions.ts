import { prismaClientForRawQueries } from 'src/prisma-client'

// specify license and attribution for data export
export async function initCustomFunctions() {
  const queries = prismaClientForRawQueries.$transaction([
    prismaClientForRawQueries.$executeRaw`
  CREATE OR REPLACE FUNCTION public.jsonb_select(json_in JSONB, keys text[])
  RETURNS JSONB AS $$
  DECLARE
      json_out JSONB := '{}';
       key text;
  BEGIN
      FOREACH key IN ARRAY keys
      loop
        IF json_in ? key THEN
            json_out := json_out || jsonb_build_object(key, json_in -> key);
          END IF;
      END LOOP;
      RETURN json_out;
  END;
  $$ LANGUAGE plpgsql;
  `,
  ])
  return queries
}

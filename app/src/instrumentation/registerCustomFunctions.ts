import { geoDataClient } from '@/src/prisma-client'

export async function registerCustomFunctions() {
  // used in generalized functions
  geoDataClient.$executeRaw`
    CREATE OR REPLACE FUNCTION atlas_jsonb_select(json_in JSONB, keys text[])
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
    $$ LANGUAGE plpgsql;`
  // used in analysis
  await geoDataClient.$executeRaw`
    CREATE OR REPLACE FUNCTION atlas_quantize_linestring(ls Geometry(LineString), res numeric)
    RETURNS TABLE(
      len numeric,
      geom Geometry(point)
    )
    AS $$
    DECLARE
      len numeric := st_length(ST_Transform(ls, 25833));
      n int := greatest(round(len / res), 1)::int;
    BEGIN
      RETURN query
      SELECT
        len / n,
        ST_LineInterpolatePoint(ls,(generate_series(1, n) - 0.5) / n::numeric) AS geom;
    END;
    $$
    LANGUAGE plpgsql;
  `
  geoDataClient.$executeRaw`
    CREATE OR REPLACE FUNCTION atlas_count_category_lengths(polygon_input GEOMETRY)
    RETURNS JSONB AS $$
    DECLARE
      category_length JSONB;
    BEGIN
        -- create a temporary table which holds all bikelanes cutted into points with their respective length
      BEGIN
        CREATE temp TABLE temp_bikelanes_quantized AS
          SELECT
            id,
            tags->>'category' AS category,
            (atlas_QuantizeLineString(geom, 100)).*
          FROM
            bikelanes;
        CREATE INDEX "temp_bikelanes_quantized_geom_idx" ON temp_bikelanes_quantized USING gist(geom);
        CREATE INDEX "temp_bikelanes_quantized_category_idx" ON temp_bikelanes_quantized (category);
      EXCEPTION
        WHEN duplicate_table THEN
          -- If the table already exists, do nothing
          RAISE NOTICE 'Using cached "temp_bikelanes_quantized" table';
      END;

      SELECT
        jsonb_object_agg(category, ROUND(total_length_km))
      INTO category_length
      FROM (
        SELECT
          category,
          SUM(bikelanes.len) / 1000.0 AS total_length_km
        FROM
          temp_bikelanes_quantized as bikelanes
        WHERE
          ST_Intersects(bikelanes.geom, polygon_input)  -- Spatial intersection with input polygon
        GROUP BY
          category
      ) AS aggregated_data;

      RETURN category_length;
    END;
    $$ LANGUAGE plpgsql;
  `
}

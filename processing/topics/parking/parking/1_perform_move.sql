-- ABOUT
-- Move parking lanes to the kerb.
-- TODO: This need to be reworked to perform_snap based on parking_kerbs

UPDATE
  public.parking_parking_lines
SET
  geom = ST_Transform(ST_OffsetCurve(ST_Simplify(ST_Transform(geom, 25833), 0.5), (tags->>'perform_move')::numeric), 3857)
WHERE
  ST_IsSimple(geom)
  AND NOT ST_IsClosed(geom)
  AND tags ? 'perform_move';

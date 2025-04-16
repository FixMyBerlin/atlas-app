-- ABOUT
-- Reverse the line direction for alle parking lines on the left.

UPDATE
  public.parking_source_parking_lines
SET
  geom = ST_Reverse(geom)
WHERE
  (tags->>'side')::text = 'left';
  -- (tags->>'offset')::numeric > 0;

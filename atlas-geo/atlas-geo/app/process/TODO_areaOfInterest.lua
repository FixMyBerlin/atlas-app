-- Goal:
-- ======
-- Our tool will have separate views for specified areas ("clients").
-- We have three areas rigth now:
--  - ZES+: Query https://github.com/FixMyBerlin/osm-scripts/blob/main/ZESPlus/AreaOfInterest/download.ts#L9-L18 with https://github.com/FixMyBerlin/osm-scripts/blob/main/ZESPlus/AreaOfInterest/areas.constant.ts#L2-L8

-- Data:
-- =======
-- 1. "Verantwortungsgebiet (Boundaries)"
-- 2.a "Betrachtungsgebiet (Boundaries)"
-- 2.b "Betrachtungsgebiet (Buffer)" – Alle Places (of type ??) in 2.a + 10km Buffer um Place + Merge zur Outline

-- Solution:
-- =======
-- TODO at https://github.com/FixMyBerlin/private-issues/issues/80

-- Learn more about this file in ./README.md

-- Introduce comments on *_verifications
-- ALTER TABLE IF EXISTS bikelanes_verification
--   ADD IF NOT EXISTS comment text
--   NULL
--   DEFAULT NULL;

-- ALTER TABLE IF EXISTS lit_verification
--   ADD IF NOT EXISTS comment text
--   NULL
--   DEFAULT NULL;

-- We now use the prisma.BikelaneVerification table for this
ALTER TABLE IF EXISTS bikelanes_verification
  RENAME TO bikelanes_verification__archive;

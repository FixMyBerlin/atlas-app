-- Learn more about this file in ./README.md

-- Introduce comments on *_verifications
ALTER TABLE IF EXISTS bikelanes_verification
  ADD IF NOT EXISTS comment text
  NULL
  DEFAULT NULL;

ALTER TABLE IF EXISTS lit_verification
  ADD IF NOT EXISTS comment text
  NULL
  DEFAULT NULL;

ALTER TABLE "User"
RENAME COLUMN "name" TO "osmName";

ALTER TABLE "User"
ADD COLUMN "firstName" TEXT;

ALTER TABLE "User"
ADD COLUMN "lastName" TEXT;

ALTER TABLE "User"
DROP COLUMN "phone";
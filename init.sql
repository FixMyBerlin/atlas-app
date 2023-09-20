CREATE TABLE public.some_table AS SELECT 1;
CREATE SCHEMA prisma;
ALTER DATABASE postgres SET search_path = "$user", prisma, public;

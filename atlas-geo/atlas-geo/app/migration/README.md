# About

- Use `cleanup.sql` to remove database tables that are no longer needed.
- Use `migration.sql` to modify the database, like adding columns that are not controlled by osm2pgsql

# Context

Database tables are persistet between deploys.

- If we abandon a table, it will persist unless removed with `cleanup.sql`
- If we change conditions in `./process/*.(lua,sql)` tabels are dropped and recreated from scratch

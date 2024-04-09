# About

Use `migration.sql` to modify the database, like adding columns that are not controlled by osm2pgsql.

# Context

Database tables are persistet between deploys.

- If we abandon a table, it will persist unless manually removed.
- Tables that are created via osm2pgsql will be dropped and recreated on every run.

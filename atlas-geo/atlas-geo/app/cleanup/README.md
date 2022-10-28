# About

Use `cleanup.sql` to remove database tables that are no longer needed.

# Context

Database tables are persistet between deploys.

- If we abandon a table, it will persist unless removed with `cleanup.sql`
- If we change conditions in `/process/*.(lua,sql)` tabels are updated
  — TODO: would stale data be removed, or just added?

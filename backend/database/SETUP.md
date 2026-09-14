# Setting up a fresh database

This is for a brand-new database only (e.g. a new environment, or a local dev
copy). Your live Railway database was built up incrementally over many small
migrations and should NOT be touched by this — it's already correct as-is.

Verified working order for a fresh install, run once each, in order:

1. `schema.sql` — skip its own `CREATE DATABASE` / `USE` lines if you're
   pointing at a database Railway (or you) already created; just run the
   `CREATE TABLE` statements against your target database.
2. `MIGRATION_social_v1.sql`
3. `MIGRATION_workoutplans_v1.sql`
4. `MIGRATION_minor_v3.sql`
5. `MIGRATION_minor_v4.sql`
6. `MIGRATION_minor_v5.sql`
7. `MIGRATION_minor_v6.sql`
8. `MIGRATION_minor_v7.sql`
9. `MIGRATION_minor_v8.sql`
10. `MIGRATION_minor_v9.sql`
11. `MIGRATION_minor_v10.sql`

**Skip `MIGRATION_workout_v2.sql` entirely** — it's historical only. Its
changes are already included directly in `schema.sql`. Running it against a
fresh `schema.sql` install will fail (it tries to create tables that already
exist in the right shape).

This full chain was tested end-to-end: schema loads cleanly, a real user can
register, log a mixed lifting+cardio workout, and get a PR recorded — all
through the real API against a freshly built database.

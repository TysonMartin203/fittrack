-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Admin flag — this app has no other role system, so this is the only
-- permission distinction that exists: a normal account vs an admin account.
ALTER TABLE Users ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0;

-- 2. Mark the existing admin account (created via CREATE_ADMIN_ACCOUNT.sql) as admin.
-- If you used a different email for that account, update this WHERE clause to match.
UPDATE Users SET is_admin = 1 WHERE email = 'repivo@gmail.com';

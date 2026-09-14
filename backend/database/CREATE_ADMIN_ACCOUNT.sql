-- Run once in Railway's MySQL "Data" console.
-- Creates a standard account with the given email/password — this app has no
-- separate admin-role/permission system, so this is a normal user account,
-- not one with elevated in-app privileges. Use it for whatever admin/testing
-- purposes you need manually.
--
-- The password hash below was generated with bcrypt (12 rounds) for
-- "adminabc123" and verified to round-trip correctly before being used here.

INSERT INTO Users (username, email, password_hash)
VALUES ('admin', 'repivo@gmail.com', '$2b$12$nyqkRHzDdTETHNSOMuo7..hPqwQslSJzzPi29zDZ2WOLa1j5yqiCa');

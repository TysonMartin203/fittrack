-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Password is no longer required if the account was created via Google sign-in
ALTER TABLE Users MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- 2. Google sign-in
ALTER TABLE Users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE;

-- 3. Forgot password — a one-time reset token with an expiry
ALTER TABLE Users ADD COLUMN reset_token VARCHAR(255) NULL;
ALTER TABLE Users ADD COLUMN reset_token_expires DATETIME NULL;

-- 4. Onboarding tutorial — whether the user has completed or skipped it
ALTER TABLE Users ADD COLUMN tutorial_done TINYINT(1) NOT NULL DEFAULT 0;

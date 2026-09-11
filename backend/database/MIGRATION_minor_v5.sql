-- Run these in Railway's MySQL "Data" console, ONE AT A TIME, in order.

-- 1. PRs can now be rep-based (bodyweight exercises) instead of only weight-based
ALTER TABLE PRs ADD COLUMN unit VARCHAR(10) NOT NULL DEFAULT 'lbs';

-- 2. Track where a meal plan came from, so "how to cook" can skip the AI call
-- for template meals that haven't been swapped (a swap marks that one meal as
-- AI-touched, so it still gets a real recipe).
ALTER TABLE MealPlans ADD COLUMN source ENUM('ai','template','custom') NOT NULL DEFAULT 'ai';

-- 3. A short bio shown on your profile
ALTER TABLE Users ADD COLUMN bio VARCHAR(280) NULL;

-- 4. Granular notification preferences (buzz and messages are separate switches)
ALTER TABLE Users ADD COLUMN notify_buzz TINYINT(1) NOT NULL DEFAULT 1;

-- 5.
ALTER TABLE Users ADD COLUMN notify_messages TINYINT(1) NOT NULL DEFAULT 1;

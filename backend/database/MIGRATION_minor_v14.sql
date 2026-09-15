-- Run in Railway's MySQL "Data" console.

-- AI photo scans build the meal name by joining every identified ingredient
-- (each with a portion description), which regularly exceeds the original
-- 150-character limit for anything beyond 2-3 items — causing a hard MySQL
-- error and a failed save. Widened generously; the backend also truncates
-- defensively so this can't happen again regardless of column size.
ALTER TABLE LoggedMeals MODIFY COLUMN name VARCHAR(500) NOT NULL;

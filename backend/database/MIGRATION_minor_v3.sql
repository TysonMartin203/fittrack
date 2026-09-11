-- Run in Railway's MySQL "Data" console.
-- Widens the FeedEvents type list to include 'challenge' (the feed now shows
-- workouts, PRs, and challenge activity — not meal/plan picks). This only
-- widens the allowed values; nothing existing is affected.

ALTER TABLE FeedEvents MODIFY COLUMN type ENUM('workout','pr','template_pick','challenge') NOT NULL;

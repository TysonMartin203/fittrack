-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Display unit preferences — data is always stored in lbs/miles; this only affects display
ALTER TABLE Users ADD COLUMN weight_unit ENUM('lbs','kg') NOT NULL DEFAULT 'lbs';
ALTER TABLE Users ADD COLUMN distance_unit ENUM('mi','km') NOT NULL DEFAULT 'mi';

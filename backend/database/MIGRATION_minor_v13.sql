-- Run in Railway's MySQL "Data" console.

-- Stores which intensity level (Casual/Moderate/Competitive) was selected for
-- a sport, so editing a past entry shows the right selection rather than
-- trying to reverse-engineer it from the stored calories. Laps and flights of
-- stairs reuse the existing distance/distance_unit columns (distance_unit set
-- to 'laps' or 'flights' as a marker) rather than needing their own columns.
ALTER TABLE WorkoutExercises ADD COLUMN intensity VARCHAR(20) NULL;

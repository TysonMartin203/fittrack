-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Expand challenge types — way more fun options beyond just workouts/PR gain
ALTER TABLE Challenges MODIFY COLUMN type
  ENUM('most_workouts','pr_gain','total_volume','most_distance','most_calories','most_meals_logged','bodyweight_reps')
  NOT NULL;

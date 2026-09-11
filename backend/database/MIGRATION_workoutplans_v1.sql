-- Run these in Railway's MySQL "Data" console, ONE AT A TIME, in order.
-- Adds: a persisted profile shared between meal and workout AI generation,
-- and a WorkoutPlans table (saved/generated multi-day programs — distinct
-- from the Workouts table, which holds actual logged workout sessions).

-- 1. A single JSON blob per user holding whatever the meal/workout generators
-- need (weight, goal weight, goal, timeline, restrictions, dislikes, wanted
-- foods, appliances). Both features read and write the same column.
ALTER TABLE Users ADD COLUMN profile JSON NULL;

-- 2. Saved workout plans (templates you've adopted, or AI-generated ones)
CREATE TABLE WorkoutPlans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  plan JSON NOT NULL,
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,
  shared_from_user_id INT NULL,
  shared_from_username VARCHAR(50) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

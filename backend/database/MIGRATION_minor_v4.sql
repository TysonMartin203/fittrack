-- Run these in Railway's MySQL "Data" console, ONE AT A TIME, in order.

-- 1. Optional name for a workout (e.g. "Leg Day"), shown before the date
ALTER TABLE Workouts ADD COLUMN name VARCHAR(100) NULL;

-- 2. Cardio milestone PRs (fastest mile, 5K, 10K, half marathon, marathon, etc.)
-- Separate from PRs (which is weight-based) since "best" here means lowest time.
CREATE TABLE CardioPRs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  milestone VARCHAR(60) NOT NULL,
  activity VARCHAR(50) NOT NULL,
  best_seconds INT NOT NULL,
  achieved_on DATE NOT NULL,
  workout_id INT NULL,
  workout_exercise_id INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE SET NULL,
  UNIQUE KEY uq_cardiopr_user_milestone (user_id, milestone)
) ENGINE=InnoDB;

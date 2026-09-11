-- Run these in Railway's MySQL "Data" console, ONE AT A TIME, in order.
-- This replaces the old single-exercise Workouts table with a structure that
-- supports multiple exercises per workout, cardio + lifting, per-set weights,
-- notes, and an optional workout photo. Existing workout rows will be lost
-- (per your OK) — PRs are preserved.

-- 1. Drop the old simple workouts table (existing workout rows will be lost)
DROP TABLE IF EXISTS Workouts;

-- 2. Recreate Workouts as a "session" — one row per logged workout
CREATE TABLE Workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  notes_before TEXT NULL,
  notes_after TEXT NULL,
  photo_path VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. One row per exercise inside a workout
CREATE TABLE WorkoutExercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_id INT NOT NULL,
  category ENUM('lifting','cardio') NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  notes TEXT NULL,
  sets INT NULL,
  reps INT NULL,
  weight DECIMAL(6,2) NULL,
  per_set_weights TINYINT(1) NOT NULL DEFAULT 0,
  duration_minutes DECIMAL(6,2) NULL,
  distance DECIMAL(6,2) NULL,
  distance_unit VARCHAR(10) NULL,
  calories INT NULL,
  avg_heart_rate INT NULL,
  pace VARCHAR(30) NULL,
  FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Per-set weight/reps breakdown (only populated when per_set_weights = 1)
CREATE TABLE WorkoutSets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_exercise_id INT NOT NULL,
  set_number INT NOT NULL,
  reps INT NULL,
  weight DECIMAL(6,2) NULL,
  FOREIGN KEY (workout_exercise_id) REFERENCES WorkoutExercises(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Let PRs link back to the workout/exercise that set them
ALTER TABLE PRs ADD COLUMN workout_id INT NULL;

-- 6.
ALTER TABLE PRs ADD COLUMN workout_exercise_id INT NULL;

-- 7.
ALTER TABLE PRs ADD FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE SET NULL;

-- 8. Let a progress photo optionally be tied to the workout it was taken during
ALTER TABLE ProgressPhotos ADD COLUMN workout_id INT NULL;

-- 9.
ALTER TABLE ProgressPhotos ADD FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE SET NULL;

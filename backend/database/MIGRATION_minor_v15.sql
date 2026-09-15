-- Run in Railway's MySQL "Data" console.

-- Public challenges keep the existing friend-visible, joinable, leaderboard
-- behavior. Personal challenges are visible only to their creator — a private
-- individual goal (e.g. "Bench 225 by June") rather than something to compete
-- on with friends.
ALTER TABLE Challenges ADD COLUMN visibility ENUM('public','personal') NOT NULL DEFAULT 'public';

-- New types for personal goals: hit an absolute target (weight lifted, reps,
-- pace, or distance in one outing) by the deadline, rather than the existing
-- types which measure activity or gain over the window.
ALTER TABLE Challenges MODIFY COLUMN type
  ENUM('most_workouts','pr_gain','total_volume','most_distance','most_calories','most_meals_logged','bodyweight_reps',
       'reach_weight','reach_reps','reach_pace','reach_distance')
  NOT NULL;

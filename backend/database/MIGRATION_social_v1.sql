-- Run these in Railway's MySQL "Data" console, ONE AT A TIME, in order.
-- Adds everything needed for the Social update: push notifications, feed,
-- reactions, crews, challenges, train-together invites, and meal plan sharing.
-- Nothing here touches or deletes existing data.

-- 1. Web push subscriptions (one row per device a user has enabled push on)
CREATE TABLE PushSubscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  endpoint VARCHAR(500) NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_endpoint (endpoint(255))
) ENGINE=InnoDB;

-- 2. In-app notification history (buzzes, shared plans, invites, etc.)
CREATE TABLE Notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(30) NOT NULL,
  title VARCHAR(120) NOT NULL,
  body VARCHAR(255) NULL,
  data JSON NULL,
  read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Feed events (workouts logged, PRs hit, starter plans picked)
CREATE TABLE FeedEvents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('workout','pr','template_pick') NOT NULL,
  ref_id INT NULL,
  headline VARCHAR(150) NOT NULL,
  detail VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. One reaction per user per feed item
CREATE TABLE Reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feed_event_id INT NOT NULL,
  user_id INT NOT NULL,
  reaction VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (feed_event_id) REFERENCES FeedEvents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_reaction_user (feed_event_id, user_id)
) ENGINE=InnoDB;

-- 5. Crews (small friend groups)
CREATE TABLE Crews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.
CREATE TABLE CrewMembers (
  crew_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (crew_id, user_id),
  FOREIGN KEY (crew_id) REFERENCES Crews(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7.
CREATE TABLE CrewMessages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crew_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crew_id) REFERENCES Crews(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Challenges (time-boxed, joinable, shared leaderboard)
CREATE TABLE Challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  type ENUM('most_workouts','pr_gain') NOT NULL,
  exercise VARCHAR(100) NULL,
  target_value DECIMAL(6,2) NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9.
CREATE TABLE ChallengeParticipants (
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (challenge_id, user_id),
  FOREIGN KEY (challenge_id) REFERENCES Challenges(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Train-together invites
CREATE TABLE TrainInvites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  proposed_at DATETIME NOT NULL,
  message VARCHAR(255) NULL,
  status ENUM('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Let a meal plan record who shared it with you
ALTER TABLE MealPlans ADD COLUMN shared_from_user_id INT NULL;

-- 12.
ALTER TABLE MealPlans ADD COLUMN shared_from_username VARCHAR(50) NULL;

-- 13. Let a progress photo optionally be tied to the workout it was taken during
-- (this was missing from the original version of this migration — if you already ran
-- steps 1-12 before, just run 13 and 14 now, nothing else needs to be re-run)
ALTER TABLE ProgressPhotos ADD COLUMN workout_id INT NULL;

-- 14.
ALTER TABLE ProgressPhotos ADD FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE SET NULL;

-- 15. Dark mode preference, saved per account
ALTER TABLE Users ADD COLUMN theme VARCHAR(10) NOT NULL DEFAULT 'light';

CREATE DATABASE IF NOT EXISTS workout_tracker;
USE workout_tracker;

CREATE TABLE IF NOT EXISTS Users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Workouts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  exercise   VARCHAR(100) NOT NULL,
  sets       INT          NOT NULL,
  reps       INT          NOT NULL,
  weight     DECIMAL(6,2) NOT NULL,
  date       DATE         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_workouts_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS PRs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  exercise    VARCHAR(100) NOT NULL,
  max_weight  DECIMAL(6,2) NOT NULL,
  achieved_on DATE         NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_pr_user_exercise (user_id, exercise),
  INDEX idx_prs_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ProgressPhotos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  file_path  VARCHAR(255) NOT NULL,
  photo_date DATE         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_photos_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Friends (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  requester_id INT NOT NULL,
  receiver_id  INT NOT NULL,
  status       ENUM('pending','accepted') NOT NULL DEFAULT 'pending',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id)  REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_friends (requester_id, receiver_id),
  INDEX idx_friends_receiver (receiver_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sender_id   INT  NOT NULL,
  receiver_id INT  NOT NULL,
  message     TEXT NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id)   REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_messages_receiver (receiver_id),
  INDEX idx_messages_sender   (sender_id)
) ENGINE=InnoDB;

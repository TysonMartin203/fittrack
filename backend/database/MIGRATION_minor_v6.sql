-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Crew invites — adding a friend to a crew now requires them to accept
CREATE TABLE CrewInvites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crew_id INT NOT NULL,
  inviter_id INT NOT NULL,
  invitee_id INT NOT NULL,
  status ENUM('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crew_id) REFERENCES Crews(id) ON DELETE CASCADE,
  FOREIGN KEY (inviter_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (invitee_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

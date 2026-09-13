-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Logged meals — actual food eaten, tracked by date, separate from meal PLANS
CREATE TABLE LoggedMeals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  meal_type ENUM('Breakfast','Lunch','Dinner','Snack') NOT NULL,
  name VARCHAR(150) NOT NULL,
  calories INT NULL,
  protein DECIMAL(6,1) NULL,
  carbs DECIMAL(6,1) NULL,
  fat DECIMAL(6,1) NULL,
  notes VARCHAR(280) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_loggedmeals_user_date ON LoggedMeals(user_id, date);

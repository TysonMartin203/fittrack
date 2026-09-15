const pool = require('../config/db');

async function logMeal({ userId, date, mealType, name, calories, protein, carbs, fat, notes, ingredients }) {
  const [result] = await pool.query(
    `INSERT INTO LoggedMeals (user_id, date, meal_type, name, calories, protein, carbs, fat, notes, ingredients)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, date, mealType, name, calories || null, protein || null, carbs || null, fat || null, notes || null, ingredients ? JSON.stringify(ingredients) : null]
  );
  return result.insertId;
}

async function getMealsForDate(userId, date) {
  const [rows] = await pool.query(
    'SELECT * FROM LoggedMeals WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
    [userId, date]
  );
  return rows;
}

async function getMealHistory(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM LoggedMeals WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT 200',
    [userId]
  );
  return rows;
}

async function deleteMeal(id, userId) {
  const [result] = await pool.query('DELETE FROM LoggedMeals WHERE id = ? AND user_id = ?', [id, userId]);
  return result.affectedRows > 0;
}

async function getDailyTotals(userId, date) {
  const [[row]] = await pool.query(
    `SELECT COALESCE(SUM(calories),0) AS calories, COALESCE(SUM(protein),0) AS protein,
            COALESCE(SUM(carbs),0) AS carbs, COALESCE(SUM(fat),0) AS fat, COUNT(*) AS mealCount
     FROM LoggedMeals WHERE user_id = ? AND date = ?`,
    [userId, date]
  );
  return {
    calories: Number(row.calories), protein: Number(row.protein),
    carbs: Number(row.carbs), fat: Number(row.fat), mealCount: row.mealCount,
  };
}

module.exports = { logMeal, getMealsForDate, getMealHistory, deleteMeal, getDailyTotals };

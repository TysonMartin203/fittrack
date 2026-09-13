const { logMeal, getMealsForDate, getMealHistory, deleteMeal, getDailyTotals } = require('../models/meallog.model');

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

async function create(req, res) {
  try {
    const { date, mealType, name, calories, protein, carbs, fat, notes } = req.body;
    if (!date || !mealType || !name?.trim()) return res.status(400).json({ error: 'date, mealType, and name are required' });
    if (!MEAL_TYPES.includes(mealType)) return res.status(400).json({ error: 'Invalid meal type' });
    const id = await logMeal({ userId: req.userId, date, mealType, name: name.trim(), calories, protein, carbs, fat, notes });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function listForDate(req, res) {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: 'date query param required' });
    const [meals, totals] = await Promise.all([
      getMealsForDate(req.userId, date),
      getDailyTotals(req.userId, date),
    ]);
    res.json({ meals, totals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function history(req, res) {
  try {
    res.json(await getMealHistory(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function remove(req, res) {
  try {
    const ok = await deleteMeal(req.params.id, req.userId);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { create, listForDate, history, remove };

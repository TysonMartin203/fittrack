const { logWorkout, getWorkouts, deleteWorkout } = require('../models/workout.model');

async function create(req, res) {
  try {
    const { exercise, sets, reps, weight, date } = req.body;
    if (!exercise || !sets || !reps || !weight || !date)
      return res.status(400).json({ error: 'All fields required' });
    const result = await logWorkout({ userId: req.userId, exercise, sets, reps, weight, date });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function list(req, res) {
  try {
    const workouts = await getWorkouts(req.userId);
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function remove(req, res) {
  try {
    const deleted = await deleteWorkout(req.params.id, req.userId);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { create, list, remove };

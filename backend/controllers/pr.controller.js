const { getAllPRs, getLoggedExercises, getExerciseHistory } = require('../models/pr.model');
const { getCardioPRs } = require('../models/cardiopr.model');

async function list(req, res) {
  try {
    const [lifting, cardio] = await Promise.all([
      getAllPRs(req.userId),
      getCardioPRs(req.userId),
    ]);
    const liftingNorm = lifting.map(p => ({ ...p, display_value: `${p.max_weight} ${p.unit || 'lbs'}` }));
    const cardioNorm = cardio.map(p => ({
      id: `cardio-${p.id}`, exercise: p.milestone, unit: 'time',
      display_value: p.formatted, achieved_on: p.achieved_on, workout_id: p.workout_id,
    }));
    res.json([...liftingNorm, ...cardioNorm].sort((a, b) => a.exercise.localeCompare(b.exercise)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function exercises(req, res) {
  try {
    res.json(await getLoggedExercises(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function history(req, res) {
  try {
    res.json(await getExerciseHistory(req.userId, req.params.exercise));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { list, exercises, history };

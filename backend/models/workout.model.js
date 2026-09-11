const pool = require('../config/db');
const { maybeUpdatePR } = require('./pr.model');

function effectiveMaxWeight(ex) {
  if (ex.perSetWeights && Array.isArray(ex.setsData) && ex.setsData.length > 0) {
    const weights = ex.setsData.map(s => Number(s.weight)).filter(w => !isNaN(w));
    return weights.length ? Math.max(...weights) : null;
  }
  return ex.weight != null && ex.weight !== '' ? Number(ex.weight) : null;
}

async function insertExercises(conn, workoutId, exercises, userId, date) {
  const prResults = [];
  let order = 0;
  for (const ex of exercises) {
    const isLifting = ex.category === 'lifting';
    const [result] = await conn.query(
      `INSERT INTO WorkoutExercises
       (workout_id, category, exercise_name, order_index, notes,
        sets, reps, weight, per_set_weights,
        duration_minutes, distance, distance_unit, calories, avg_heart_rate, pace)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workoutId, ex.category, ex.exerciseName, order++, ex.notes || null,
        isLifting ? (ex.sets || null) : null,
        isLifting ? (ex.reps || null) : null,
        isLifting ? (ex.weight != null && ex.weight !== '' ? ex.weight : null) : null,
        isLifting && ex.perSetWeights ? 1 : 0,
        !isLifting ? (ex.durationMinutes || null) : null,
        !isLifting ? (ex.distance || null) : null,
        !isLifting ? (ex.distanceUnit || null) : null,
        !isLifting ? (ex.calories || null) : null,
        !isLifting ? (ex.avgHeartRate || null) : null,
        !isLifting ? (ex.pace || null) : null,
      ]
    );
    const workoutExerciseId = result.insertId;

    if (isLifting && ex.perSetWeights && Array.isArray(ex.setsData)) {
      for (let i = 0; i < ex.setsData.length; i++) {
        const s = ex.setsData[i];
        await conn.query(
          'INSERT INTO WorkoutSets (workout_exercise_id, set_number, reps, weight) VALUES (?, ?, ?, ?)',
          [workoutExerciseId, i + 1, s.reps || null, s.weight != null && s.weight !== '' ? s.weight : null]
        );
      }
    }

    if (isLifting) {
      const maxWeight = effectiveMaxWeight(ex);
      if (maxWeight != null) {
        const prResult = await maybeUpdatePR({
          userId, exercise: ex.exerciseName, weight: maxWeight, date,
          workoutId, workoutExerciseId,
        });
        prResults.push({ exercise: ex.exerciseName, ...prResult });
      }
    }
  }
  return prResults;
}

async function createWorkout({ userId, date, notesBefore, notesAfter, photoPath, exercises }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [wResult] = await conn.query(
      'INSERT INTO Workouts (user_id, date, notes_before, notes_after, photo_path) VALUES (?, ?, ?, ?, ?)',
      [userId, date, notesBefore || null, notesAfter || null, photoPath || null]
    );
    const workoutId = wResult.insertId;
    const prResults = await insertExercises(conn, workoutId, exercises || [], userId, date);
    await conn.commit();
    return { workoutId, prResults };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateWorkout(id, userId, { date, notesBefore, notesAfter, photoPath, exercises }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [owned] = await conn.query('SELECT id, photo_path FROM Workouts WHERE id = ? AND user_id = ?', [id, userId]);
    if (!owned[0]) { await conn.rollback(); return null; }

    const finalPhotoPath = photoPath !== undefined ? photoPath : owned[0].photo_path;
    await conn.query(
      'UPDATE Workouts SET date = ?, notes_before = ?, notes_after = ?, photo_path = ? WHERE id = ?',
      [date, notesBefore || null, notesAfter || null, finalPhotoPath, id]
    );
    // Simplest correct approach to edits: replace all exercises for this workout.
    await conn.query('DELETE FROM WorkoutExercises WHERE workout_id = ?', [id]);
    const prResults = await insertExercises(conn, id, exercises || [], userId, date);
    await conn.commit();
    return { workoutId: Number(id), prResults };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getWorkouts(userId) {
  const [rows] = await pool.query(
    `SELECT w.id, w.date, w.notes_before, w.notes_after, w.photo_path, w.created_at,
            COUNT(we.id) AS exercise_count,
            GROUP_CONCAT(DISTINCT we.category) AS categories,
            SUBSTRING_INDEX(GROUP_CONCAT(we.exercise_name ORDER BY we.order_index), ',', 1) AS first_exercise
     FROM Workouts w
     LEFT JOIN WorkoutExercises we ON we.workout_id = w.id
     WHERE w.user_id = ?
     GROUP BY w.id
     ORDER BY w.date DESC, w.created_at DESC`,
    [userId]
  );
  return rows;
}

async function getWorkoutById(id, userId) {
  const [wRows] = await pool.query('SELECT * FROM Workouts WHERE id = ? AND user_id = ?', [id, userId]);
  if (!wRows[0]) return null;
  const workout = wRows[0];

  const [exRows] = await pool.query(
    'SELECT * FROM WorkoutExercises WHERE workout_id = ? ORDER BY order_index ASC, id ASC',
    [id]
  );
  const exerciseIds = exRows.map(e => e.id);
  let setsByExercise = {};
  if (exerciseIds.length) {
    const [setRows] = await pool.query(
      `SELECT * FROM WorkoutSets WHERE workout_exercise_id IN (?) ORDER BY set_number ASC`,
      [exerciseIds]
    );
    setsByExercise = setRows.reduce((acc, s) => {
      (acc[s.workout_exercise_id] = acc[s.workout_exercise_id] || []).push(s);
      return acc;
    }, {});
  }

  workout.exercises = exRows.map(e => ({ ...e, sets_data: setsByExercise[e.id] || [] }));
  return workout;
}

async function deleteWorkout(id, userId) {
  const [result] = await pool.query(
    'DELETE FROM Workouts WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { createWorkout, updateWorkout, getWorkouts, getWorkoutById, deleteWorkout };

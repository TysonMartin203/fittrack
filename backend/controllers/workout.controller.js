const fs = require('fs');
const path = require('path');
const { savePhoto } = require('../models/photo.model');
const pool = require('../config/db');
const {
  createWorkout, updateWorkout, getWorkouts, getWorkoutById, getWorkoutForViewing,
  deleteWorkout, deleteWorkoutPhoto,
} = require('../models/workout.model');

function parsePayload(req) {
  // Body arrives as multipart/form-data with a JSON "data" field
  // (plus an optional "photo" file), so both create and edit can attach a photo.
  const raw = req.body.data;
  if (!raw) throw Object.assign(new Error('Missing workout data'), { status: 400 });
  const data = JSON.parse(raw);
  if (!data.date) throw Object.assign(new Error('Date is required'), { status: 400 });
  if (!Array.isArray(data.exercises) || data.exercises.length === 0)
    throw Object.assign(new Error('At least one exercise is required'), { status: 400 });
  for (const ex of data.exercises) {
    if (!ex.exerciseName || !ex.category)
      throw Object.assign(new Error('Each exercise needs a name and category'), { status: 400 });
  }
  return data;
}

async function create(req, res) {
  try {
    const data = parsePayload(req);
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await createWorkout({
      userId: req.userId,
      name: data.name,
      date: data.date,
      notesBefore: data.notesBefore,
      notesAfter: data.notesAfter,
      photoPath,
      exercises: data.exercises,
    });

    if (photoPath) {
      await savePhoto({ userId: req.userId, filePath: photoPath, photoDate: data.date, workoutId: result.workoutId });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
  }
}

async function update(req, res) {
  try {
    const data = parsePayload(req);
    const photoPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const result = await updateWorkout(req.params.id, req.userId, {
      name: data.name,
      date: data.date,
      notesBefore: data.notesBefore,
      notesAfter: data.notesAfter,
      photoPath,
      exercises: data.exercises,
    });
    if (!result) return res.status(404).json({ error: 'Not found' });

    if (photoPath) {
      await savePhoto({ userId: req.userId, filePath: photoPath, photoDate: data.date, workoutId: result.workoutId });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
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

async function getOne(req, res) {
  try {
    const workout = await getWorkoutById(req.params.id, req.userId);
    if (!workout) return res.status(404).json({ error: 'Not found' });
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Friend-safe read-only view — used from the Feed. Never includes the photo.
async function getView(req, res) {
  try {
    const workout = await getWorkoutForViewing(req.params.id, req.userId);
    if (!workout) return res.status(404).json({ error: 'Not found' });
    if (workout.forbidden) return res.status(403).json({ error: 'Not friends with this user' });
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Remove a workout's photo. `keep=true` leaves it in Progress Photos (just
// unlinks it from this workout); `keep=false` deletes it entirely, file included.
async function removePhoto(req, res) {
  try {
    const keep = req.query.keep === 'true';
    const oldPath = await deleteWorkoutPhoto(req.params.id, req.userId);
    if (oldPath === null) return res.status(404).json({ error: 'Not found' });
    if (!oldPath) return res.json({ success: true }); // no photo was attached anyway

    const [[photoRow]] = await pool.query(
      'SELECT id FROM ProgressPhotos WHERE user_id = ? AND file_path = ? AND workout_id = ?',
      [req.userId, oldPath, req.params.id]
    );

    if (keep) {
      if (photoRow) await pool.query('UPDATE ProgressPhotos SET workout_id = NULL WHERE id = ?', [photoRow.id]);
    } else {
      if (photoRow) await pool.query('DELETE FROM ProgressPhotos WHERE id = ?', [photoRow.id]);
      const abs = path.join(__dirname, '..', 'public', 'uploads', oldPath.split('/').pop());
      fs.unlink(abs, () => {}); // best-effort; fine if it's already gone
    }

    res.json({ success: true });
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

module.exports = { create, update, list, getOne, getView, removePhoto, remove };

const pool = require('../config/db');
const { createUser, findByEmail, findByUsername } = require('../models/user.model');

async function listUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, username, email, is_admin, google_id IS NOT NULL AS has_google,
              password_hash IS NULL AS needs_password, created_at
       FROM Users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createAccount(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'username, email, and password required' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (await findByEmail(email)) return res.status(409).json({ error: 'Email already in use' });
    if (await findByUsername(username)) return res.status(409).json({ error: 'Username already in use' });
    const id = await createUser({ username, email, password });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function deleteAccount(req, res) {
  try {
    const targetId = Number(req.params.id);
    if (targetId === req.userId) return res.status(400).json({ error: "You can't delete your own account from here." });
    const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [targetId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Clears the password so the account holder is prompted to set a new one next
// time they try to log in (see auth.controller's login for that flow).
async function resetUserPassword(req, res) {
  try {
    const [result] = await pool.query(
      'UPDATE Users SET password_hash = NULL, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function listCrews(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.created_at, u.username AS creator_username,
              (SELECT COUNT(*) FROM CrewMembers cm WHERE cm.crew_id = c.id) AS member_count
       FROM Crews c LEFT JOIN Users u ON u.id = c.creator_id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// A user's workouts for support purposes — deliberately excludes progress
// photos, which stay private even to admins.
async function userWorkouts(req, res) {
  try {
    const [workouts] = await pool.query(
      'SELECT id, date, name, notes_before, notes_after FROM Workouts WHERE user_id = ? ORDER BY date DESC LIMIT 100',
      [req.params.id]
    );
    if (workouts.length) {
      const ids = workouts.map(w => w.id);
      const [exercises] = await pool.query(
        `SELECT * FROM WorkoutExercises WHERE workout_id IN (${ids.map(() => '?').join(',')}) ORDER BY order_index ASC`,
        ids
      );
      workouts.forEach(w => { w.exercises = exercises.filter(e => e.workout_id === w.id); });
    }
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listUsers, createAccount, deleteAccount, resetUserPassword, listCrews, userWorkouts };

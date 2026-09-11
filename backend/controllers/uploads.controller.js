const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

async function serve(req, res) {
  const filename = req.params.filename;
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  const filePath = `/uploads/${filename}`;

  try {
    const [[isPhoto]]   = await pool.query('SELECT 1 AS x FROM ProgressPhotos WHERE file_path = ? AND user_id = ? LIMIT 1', [filePath, req.userId]);
    const [[isWorkout]] = await pool.query('SELECT 1 AS x FROM Workouts WHERE photo_path = ? AND user_id = ? LIMIT 1', [filePath, req.userId]);
    const [[isAvatar]]  = await pool.query('SELECT 1 AS x FROM Users WHERE avatar_url = ? AND id = ? LIMIT 1', [filePath, req.userId]);

    if (!isPhoto && !isWorkout && !isAvatar) {
      return res.status(403).json({ error: 'Not authorized to view this file' });
    }

    const abs = path.join(__dirname, '..', 'public', 'uploads', filename);
    if (!fs.existsSync(abs)) return res.status(404).json({ error: 'Not found' });
    res.sendFile(abs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { serve };

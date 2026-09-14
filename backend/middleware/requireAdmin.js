const pool = require('../config/db');

// Must run after the regular auth middleware (needs req.userId already set).
async function requireAdmin(req, res, next) {
  try {
    const [[row]] = await pool.query('SELECT is_admin FROM Users WHERE id = ?', [req.userId]);
    if (!row || !row.is_admin) return res.status(403).json({ error: 'Admin access required' });
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = requireAdmin;

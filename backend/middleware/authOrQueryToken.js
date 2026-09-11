const jwt = require('jsonwebtoken');

// Same as middleware/auth.js, but also accepts ?token=... in the query string.
// Only used for the file-serving route — <img>/<video> tags can't attach an
// Authorization header, so a same-origin query-string token is the practical way
// to keep uploaded files behind a login check without extra setup.
function authOrQueryToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.query.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authOrQueryToken;

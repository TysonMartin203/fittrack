const path = require('path');

// On Railway, set UPLOADS_DIR to the mount path of a persistent Volume (e.g. /data)
// so uploaded files survive redeploys. Without a Volume, Railway's filesystem is
// wiped clean on every deploy — anything written here disappears on the next push.
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'public', 'uploads');

module.exports = UPLOADS_DIR;

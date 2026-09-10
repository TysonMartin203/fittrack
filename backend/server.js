require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// CORS — allow both local dev and the deployed Netlify frontend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Serve uploaded progress photos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API routes
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/workouts', require('./routes/workout.routes'));
app.use('/api/prs',      require('./routes/pr.routes'));
app.use('/api/photos',   require('./routes/photo.routes'));
app.use('/api/friends',  require('./routes/friend.routes'));
app.use('/api/messages', require('./routes/message.routes'));

// Health check (Railway uses this)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FitTrack API running on port ${PORT}`));

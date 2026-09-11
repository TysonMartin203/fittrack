require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/workouts',     require('./routes/workout.routes'));
app.use('/api/prs',          require('./routes/pr.routes'));
app.use('/api/photos',       require('./routes/photo.routes'));
app.use('/api/friends',      require('./routes/friend.routes'));
app.use('/api/messages',     require('./routes/message.routes'));
app.use('/api/meals',        require('./routes/meal.routes'));
app.use('/api/achievements', require('./routes/achievement.routes'));
app.use('/api/push',         require('./routes/push.routes'));
app.use('/api/feed',         require('./routes/feed.routes'));
app.use('/api/social',       require('./routes/social.routes'));
app.use('/api/crews',        require('./routes/crew.routes'));
app.use('/api/challenges',   require('./routes/challenge.routes'));
app.use('/api/invites',      require('./routes/invite.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FitTrack API on port ${PORT}`));

const pool = require('../config/db');

const ACHIEVEMENTS = [
  // Workouts
  { id: 'first_workout',   title: 'First Rep',       desc: 'Log your first workout',         icon: '🏋️', check: c => c.workouts >= 1 },
  { id: 'five_workouts',   title: 'Getting Going',   desc: 'Log 5 workouts',                  icon: '💪', check: c => c.workouts >= 5 },
  { id: 'ten_workouts',    title: 'On a Roll',        desc: 'Log 10 workouts',                 icon: '🔥', check: c => c.workouts >= 10 },
  { id: 'twenty_workouts', title: 'Consistent',       desc: 'Log 20 workouts',                 icon: '⚡', check: c => c.workouts >= 20 },
  { id: 'fifty_workouts',  title: 'Dedicated',        desc: 'Log 50 workouts',                 icon: '🌟', check: c => c.workouts >= 50 },
  { id: 'hundred_workouts',title: 'Century Club',     desc: 'Log 100 workouts',                icon: '💯', check: c => c.workouts >= 100 },
  // PRs
  { id: 'first_pr',        title: 'Personal Best',   desc: 'Set your first PR',               icon: '🏆', check: c => c.prs >= 1 },
  { id: 'five_prs',        title: 'PR Machine',      desc: 'Set 5 personal records',          icon: '🥇', check: c => c.prs >= 5 },
  { id: 'ten_prs',         title: 'Record Breaker',  desc: 'Set 10 personal records',         icon: '💎', check: c => c.prs >= 10 },
  // Photos
  { id: 'first_photo',     title: 'First Glimpse',   desc: 'Upload your first progress photo',icon: '📸', check: c => c.photos >= 1 },
  { id: 'five_photos',     title: 'Progress Tracker',desc: 'Upload 5 progress photos',        icon: '🖼️', check: c => c.photos >= 5 },
  // Friends
  { id: 'first_friend',    title: 'Social Gains',    desc: 'Add your first friend',           icon: '🤝', check: c => c.friends >= 1 },
  { id: 'three_friends',   title: 'Squad Up',        desc: 'Add 3 friends',                   icon: '👥', check: c => c.friends >= 3 },
  { id: 'five_friends',    title: 'The Crew',        desc: 'Add 5 friends',                   icon: '🎯', check: c => c.friends >= 5 },
  // Messages
  { id: 'first_message',   title: 'Link Up',         desc: 'Send your first message',         icon: '💬', check: c => c.messages >= 1 },
  // Meals
  { id: 'first_meal',      title: 'Meal Prepper',    desc: 'Generate your first meal plan',   icon: '🥗', check: c => c.meals >= 1 },
  { id: 'three_meals',     title: 'Healthy Habits',  desc: 'Generate 3 meal plans',           icon: '🌿', check: c => c.meals >= 3 },
  // Profile
  { id: 'has_avatar',      title: 'Face of the Game',desc: 'Upload a profile photo',          icon: '😎', check: c => c.hasAvatar },
  // Cardio milestones
  { id: 'first_mile',      title: 'First Mile',      desc: 'Log a timed mile',                icon: '🏃', check: c => c.milestones.has('Fastest Mile') },
  { id: 'first_5k',        title: '5K Finisher',     desc: 'Log a timed 5K',                  icon: '🎽', check: c => c.milestones.has('Fastest 5K') },
  { id: 'first_10k',       title: '10K Finisher',    desc: 'Log a timed 10K',                 icon: '🏅', check: c => c.milestones.has('Fastest 10K') },
  { id: 'first_half',      title: 'Half Marathoner', desc: 'Log a half marathon',             icon: '🥈', check: c => c.milestones.has('Fastest Half Marathon') },
  { id: 'first_marathon',  title: 'Marathoner',      desc: 'Log a full marathon',             icon: '🥇', check: c => c.milestones.has('Fastest Marathon') },
  { id: 'first_century',   title: 'Century Rider',   desc: 'Log a 100-mile ride',             icon: '🚴', check: c => c.milestones.has('Fastest Century') },
  { id: 'first_mile_swim', title: 'Mile Swimmer',    desc: 'Log a timed mile swim',           icon: '🏊', check: c => c.milestones.has('Fastest Mile Swim') },
];

async function computeAchievements(uid) {
  const [[wRow]]  = await pool.query('SELECT COUNT(*) as n FROM Workouts WHERE user_id=?', [uid]);
  const [[prRow]] = await pool.query('SELECT COUNT(*) as n FROM PRs WHERE user_id=?', [uid]);
  const [[phRow]] = await pool.query('SELECT COUNT(*) as n FROM ProgressPhotos WHERE user_id=?', [uid]);
  const [[frRow]] = await pool.query(
    'SELECT COUNT(*) as n FROM Friends WHERE (requester_id=? OR receiver_id=?) AND status="accepted"', [uid,uid]);
  const [[mgRow]] = await pool.query('SELECT COUNT(*) as n FROM Messages WHERE sender_id=?', [uid]);
  const [[mpRow]] = await pool.query('SELECT COUNT(*) as n FROM MealPlans WHERE user_id=? AND plan IS NOT NULL', [uid]).catch(() => [[{n:0}]]);
  const [[avRow]] = await pool.query('SELECT avatar_url FROM Users WHERE id=?', [uid]);
  const [cpRows] = await pool.query('SELECT DISTINCT milestone FROM CardioPRs WHERE user_id=?', [uid]).catch(() => [[]]);

  const counts = {
    workouts: wRow.n, prs: prRow.n, photos: phRow.n,
    friends: frRow.n, messages: mgRow.n, meals: mpRow.n,
    hasAvatar: !!avRow?.avatar_url,
    milestones: new Set(cpRows.map(r => r.milestone)),
  };

  return ACHIEVEMENTS.map(a => ({
    id: a.id, title: a.title, desc: a.desc, icon: a.icon,
    unlocked: a.check(counts),
  }));
}

async function getAchievements(req, res) {
  try {
    const result = await computeAchievements(req.userId);
    res.json({ achievements: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getAchievements, computeAchievements };

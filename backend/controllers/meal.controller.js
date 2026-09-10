const pool = require('../config/db');
const Anthropic = require('@anthropic-ai/sdk');

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS MealPlans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      profile JSON,
      plan JSON,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
}

async function getPlan(req, res) {
  try {
    await ensureTable();
    const [rows] = await pool.query('SELECT profile, plan FROM MealPlans WHERE user_id = ?', [req.userId]);
    if (!rows[0]) return res.json({ profile: null, plan: null });
    res.json({ profile: rows[0].profile, plan: rows[0].plan });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
}

async function saveProfile(req, res) {
  try {
    await ensureTable();
    await pool.query(
      `INSERT INTO MealPlans (user_id, profile) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE profile = VALUES(profile)`,
      [req.userId, JSON.stringify(req.body)]
    );
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
}

async function generate(req, res) {
  try {
    await ensureTable();
    const client = getClient();
    const { weight, goalWeight, goal, timeline, restrictions = [], dislikes = '' } = req.body;

    // Get user's PRs for fitness context
    const [prs] = await pool.query('SELECT exercise, max_weight FROM PRs WHERE user_id = ? LIMIT 5', [req.userId]);
    const prText = prs.length > 0 ? prs.map(p => `${p.exercise}: ${p.max_weight}lbs`).join(', ') : 'Not provided';

    const prompt = `You are a certified nutritionist and personal trainer. Create a personalized 3-day meal plan (Monday, Tuesday, Wednesday) as JSON.

User stats:
- Current weight: ${weight || 'not provided'} lbs
- Goal weight: ${goalWeight || 'not provided'} lbs  
- Goal: ${goal}
- Timeline: ${timeline || 'not provided'} weeks
- Lifting PRs: ${prText}
- Dietary restrictions: ${restrictions.length > 0 ? restrictions.join(', ') : 'none'}
- Foods to avoid: ${dislikes || 'none'}

Return ONLY valid JSON, no markdown, no explanation. Structure:
{
  "daily_calories": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "Breakfast",
          "name": "Meal name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "ingredients": ["item1", "item2"],
          "can_substitute": true
        }
      ]
    }
  ]
}

Include Breakfast, Lunch, Dinner, and one Snack per day. Make meals practical, delicious, and scientifically sound.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text.trim();
    const plan = JSON.parse(text);

    // Save profile + plan
    await pool.query(
      `INSERT INTO MealPlans (user_id, profile, plan) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE profile = VALUES(profile), plan = VALUES(plan)`,
      [req.userId, JSON.stringify(req.body), JSON.stringify(plan)]
    );

    res.json({ plan });
  } catch (err) {
    console.error(err);
    if (err.message === 'ANTHROPIC_API_KEY not set')
      return res.status(503).json({ error: 'AI meal planning not configured yet. Ask the admin to add the API key.' });
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
}

async function swap(req, res) {
  try {
    const client = getClient();
    const { mealName, restrictions = [], macroTarget } = req.body;

    const prompt = `Suggest one alternative meal to replace "${mealName}".
Dietary restrictions: ${restrictions.length > 0 ? restrictions.join(', ') : 'none'}.
Match approximately: ${macroTarget.calories} calories, ${macroTarget.protein}g protein, ${macroTarget.carbs}g carbs, ${macroTarget.fat}g fat.
Return ONLY JSON: { "name": "...", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": [...], "can_substitute": true }`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    });

    const meal = JSON.parse(message.content[0].text.trim());
    res.json({ meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Swap failed' });
  }
}

module.exports = { getPlan, saveProfile, generate, swap };

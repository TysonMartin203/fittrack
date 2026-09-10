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
    const { weight, goalWeight, goal, timeline, restrictions = [], dislikes = '', wantedFoods = '', appliances = [] } = req.body;

    const [prs] = await pool.query('SELECT exercise, max_weight FROM PRs WHERE user_id = ? LIMIT 5', [req.userId]);
    const prText = prs.length > 0 ? prs.map(p => `${p.exercise}: ${p.max_weight}lbs`).join(', ') : 'Not provided';

    const applianceText = appliances.length > 0 ? appliances.join(', ') : 'stovetop, oven, microwave (assume basic)';

    const prompt = `You are a certified nutritionist and personal trainer. Create a budget-friendly 7-day meal plan as JSON.

CRITICAL BUDGET RULES:
- Reuse proteins across multiple days (e.g. buy a whole chicken breast pack and use across 3 days)
- Use the same base ingredients in different ways throughout the week
- Prioritize affordable proteins: eggs, canned tuna, chicken thighs, ground turkey, beans, lentils
- Use seasonal/affordable produce: carrots, cabbage, bananas, apples, frozen vegetables
- Staple grains: oats, rice, pasta, bread — use repeatedly across the week
- Keep weekly grocery cost under $75-100 for one person

User stats:
- Current weight: ${weight || 'not provided'} lbs
- Goal weight: ${goalWeight || 'not provided'} lbs
- Goal: ${goal}
- Timeline: ${timeline || 'not provided'} weeks
- Lifting PRs: ${prText}
- Dietary restrictions: ${restrictions.length > 0 ? restrictions.join(', ') : 'none'}
- Foods to avoid: ${dislikes || 'none'}
- Foods to include: ${wantedFoods || 'none specified'}
- Available kitchen appliances: ${applianceText}

IMPORTANT: Only suggest recipes that can be made with the available appliances listed above.

Return ONLY valid JSON, no markdown. Structure:
{
  "daily_calories": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "budget_tip": "one sentence tip about saving money this week",
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
          "ingredients": ["item with amount e.g. 2 eggs", "1 cup oats"],
          "can_substitute": true
        }
      ]
    }
  ]
}

Include Breakfast, Lunch, Dinner, and one Snack per day for all 7 days (Monday through Sunday).`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }]
    });

    let text = message.content[0].text.trim();
    // Strip any markdown code fences if present
    text = text.replace(/^```json\s*/,'').replace(/\s*```$/,'').trim();

    const plan = JSON.parse(text);

    await pool.query(
      `INSERT INTO MealPlans (user_id, profile, plan) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE profile = VALUES(profile), plan = VALUES(plan)`,
      [req.userId, JSON.stringify(req.body), JSON.stringify(plan)]
    );

    res.json({ plan });
  } catch (err) {
    console.error(err);
    if (err.message === 'ANTHROPIC_API_KEY not set')
      return res.status(503).json({ error: 'AI meal planning not configured yet.' });
    res.status(500).json({ error: 'Failed to generate meal plan: ' + err.message });
  }
}

async function swap(req, res) {
  try {
    const client = getClient();
    const { mealName, restrictions = [], macroTarget, appliances = [] } = req.body;
    const applianceText = appliances.length > 0 ? appliances.join(', ') : 'stovetop, oven, microwave';

    const prompt = `Suggest one budget-friendly alternative meal to replace "${mealName}".
Dietary restrictions: ${restrictions.length > 0 ? restrictions.join(', ') : 'none'}.
Available appliances: ${applianceText}.
Match approximately: ${macroTarget.calories} calories, ${macroTarget.protein}g protein, ${macroTarget.carbs}g carbs, ${macroTarget.fat}g fat.
Use affordable, common ingredients. Return ONLY JSON:
{ "name": "...", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["item with amount"], "can_substitute": true }`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });

    let text = message.content[0].text.trim();
    text = text.replace(/^```json\s*/,'').replace(/\s*```$/,'').trim();
    const meal = JSON.parse(text);
    res.json({ meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Swap failed' });
  }
}

module.exports = { getPlan, saveProfile, generate, swap };

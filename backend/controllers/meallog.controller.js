const { logMeal, getMealsForDate, getMealHistory, deleteMeal, getDailyTotals } = require('../models/meallog.model');
const { getProfile } = require('../models/profile.model');
const Anthropic = require('@anthropic-ai/sdk');

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

async function create(req, res) {
  try {
    const { date, mealType, name, calories, protein, carbs, fat, notes } = req.body;
    if (!date || !mealType || !name?.trim()) return res.status(400).json({ error: 'date, mealType, and name are required' });
    if (!MEAL_TYPES.includes(mealType)) return res.status(400).json({ error: 'Invalid meal type' });
    const id = await logMeal({ userId: req.userId, date, mealType, name: name.trim(), calories, protein, carbs, fat, notes });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function listForDate(req, res) {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: 'date query param required' });
    const [meals, totals] = await Promise.all([
      getMealsForDate(req.userId, date),
      getDailyTotals(req.userId, date),
    ]);
    res.json({ meals, totals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function history(req, res) {
  try {
    res.json(await getMealHistory(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function remove(req, res) {
  try {
    const ok = await deleteMeal(req.params.id, req.userId);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Identify a food photo and estimate calories/macros. The photo itself is never
// saved — only used for this one-time recognition — so no upload/storage plumbing needed.
async function recognize(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No photo provided' });
    const client = getClient();

    const profile = await getProfile(req.userId).catch(() => null);
    const palmWidth = profile?.palmWidth || null;

    const scaleNote = palmWidth
      ? `The user's palm width (straight across, not including thumb) is ${palmWidth} inches. If a hand is visible in the photo, use it as a scale reference to judge the size of the food more accurately.`
      : `The user hasn't recorded their exact palm width. If a hand is visible in the photo, still use it as a rough scale reference — assume an average adult palm width of about 3.5 inches. Otherwise, estimate portion size using typical plate/bowl/utensil sizes visible in the photo.`;

    const prompt = `Identify the food in this photo and estimate its nutrition. ${scaleNote}

Return ONLY valid JSON, no markdown, in this exact structure:
{
  "name": "short description of the food, e.g. 'Grilled chicken breast with rice and broccoli'",
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "confidence": "high" | "medium" | "low"
}

These are estimates from a photo, not a lab measurement — give your best reasonable guess rather than refusing. If multiple distinct food items are visible, combine them into one entry describing the whole plate.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: req.file.mimetype, data: req.file.buffer.toString('base64') } },
          { type: 'text', text: prompt },
        ],
      }],
    });

    let text = message.content[0].text.trim();
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const result = JSON.parse(text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not read that photo: ' + err.message });
  }
}

// Parse a spoken description of a meal into structured fields — reuses the
// same "estimate, don't refuse" approach as the photo recognizer, just from text.
async function parseVoice(req, res) {
  try {
    const { transcript } = req.body;
    if (!transcript?.trim()) return res.status(400).json({ error: 'No transcript provided' });
    const client = getClient();

    const prompt = `The user spoke this description of a meal they ate: "${transcript.trim()}"

Turn it into structured nutrition data. Return ONLY valid JSON, no markdown, in this exact structure:
{
  "name": "short description of the food",
  "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack" (guess based on context, default "Snack" if unclear),
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams)
}

Give your best reasonable estimate rather than refusing, even if the description is vague or casual.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    let text = message.content[0].text.trim();
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    res.json(JSON.parse(text));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not parse that: ' + err.message });
  }
}

module.exports = { create, listForDate, history, remove, recognize, parseVoice };

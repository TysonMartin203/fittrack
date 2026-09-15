const { logMeal, getMealsForDate, getMealHistory, deleteMeal, getDailyTotals, getCaloriesBurned } = require('../models/meallog.model');
const { getProfile } = require('../models/profile.model');
const Anthropic = require('@anthropic-ai/sdk');

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

async function create(req, res) {
  try {
    const { date, mealType, name, calories, protein, carbs, fat, notes, ingredients } = req.body;
    if (!date || !mealType || !name?.trim()) return res.status(400).json({ error: 'date, mealType, and name are required' });
    if (!MEAL_TYPES.includes(mealType)) return res.status(400).json({ error: 'Invalid meal type' });
    const cleanIngredients = Array.isArray(ingredients)
      ? ingredients.filter(i => i && i.name && i.name.trim()).map(i => ({
          name: i.name.trim(),
          calories: i.calories || null, protein: i.protein || null, carbs: i.carbs || null, fat: i.fat || null,
        }))
      : null;
    const id = await logMeal({ userId: req.userId, date, mealType, name: name.trim(), calories, protein, carbs, fat, notes, ingredients: cleanIngredients?.length ? cleanIngredients : null });
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
    const [meals, totals, caloriesBurned] = await Promise.all([
      getMealsForDate(req.userId, date),
      getDailyTotals(req.userId, date),
      getCaloriesBurned(req.userId, date),
    ]);
    res.json({ meals, totals: { ...totals, caloriesBurned } });
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
      ? `The user's palm width (straight across, not including thumb) is ${palmWidth} inches. If a hand is visible in the photo, use it as a precise scale reference.`
      : `The user hasn't recorded their palm width. If a hand is visible, assume an average adult palm width of about 3.5 inches as a rough scale reference.`;

    const prompt = `You are an experienced dietitian estimating a meal's nutrition from a photo. Work through this carefully — accuracy matters more than speed.

${scaleNote} Other useful size references if visible: a standard dinner plate is ~10-11 inches across, a standard bowl holds ~16-20oz, a fist is roughly 1 cup, a deck-of-cards-sized portion of meat is ~3-4oz, a thumb is roughly 1oz of cheese or fat.

Steps:
1. Identify each distinct food/ingredient visible on the plate separately — don't lump them into one guess.
2. For each item, estimate its portion size using the visual scale references above (plate/bowl size, hand if visible, density and height of the pile).
3. Consider preparation method from visual cues (fried vs. baked vs. steamed, visible oil sheen, breading, cheese, sauce, dressing) — these are the single biggest source of underestimated calories in photo-based tracking, since oil and dressing are often invisible or hard to judge but calorically dense. If the food looks like it was cooked with oil/butter or has a sauce/dressing, factor that in even though you can't see the exact amount.
4. Estimate calories and macros for each item individually, then sum them for the totals.
5. Note any meaningful assumptions or uncertainty (e.g. "assumed steamed, not roasted with oil" or "sauce could add 100-200 cal if creamy rather than vinegar-based") so the user can adjust if you guessed wrong.

Return ONLY valid JSON, no markdown, in this exact structure:
{
  "name": "short combined description for display, e.g. 'Grilled chicken breast with rice and broccoli'",
  "items": [
    { "item": "e.g. Grilled chicken breast", "portion": "e.g. ~6oz, estimated from plate size", "calories": number, "protein": number, "carbs": number, "fat": number }
  ],
  "calories": number (sum of items),
  "protein": number (grams, sum of items),
  "carbs": number (grams, sum of items),
  "fat": number (grams, sum of items),
  "confidence": "high" | "medium" | "low",
  "notes": "1-2 sentences on key assumptions or what could shift the estimate, or empty string if nothing notable"
}

Give your best reasonable estimate rather than refusing, even when uncertain — that's the whole point of this tool. Use "low" confidence honestly when the dish is complex, mixed, or heavily sauced rather than defaulting to "medium".`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
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

Turn it into structured nutrition data. If they described multiple distinct foods, break them into separate items rather than one lump estimate. Return ONLY valid JSON, no markdown, in this exact structure:
{
  "name": "short combined description of the food",
  "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack" (guess based on context, default "Snack" if unclear),
  "items": [
    { "item": "e.g. Grilled chicken breast", "calories": number, "protein": number, "carbs": number, "fat": number }
  ],
  "calories": number (sum of items),
  "protein": number (grams, sum of items),
  "carbs": number (grams, sum of items),
  "fat": number (grams, sum of items)
}

Give your best reasonable estimate rather than refusing, even if the description is vague or casual.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
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

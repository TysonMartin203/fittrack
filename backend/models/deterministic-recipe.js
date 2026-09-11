const PROTEIN_RE = /chicken|beef|turkey|pork|salmon|tuna|shrimp|steak|sausage|egg|tofu|tempeh|bean|lentil|chickpea|fish|cod|bacon|ham/i;
const CARB_RE = /rice|pasta|potato|bread|tortilla|oat|quinoa|noodle|bagel|pancake|waffle|couscous|farro/i;
const VEG_RE = /broccoli|spinach|kale|pepper|onion|carrot|tomato|zucchini|cucumber|lettuce|mushroom|asparagus|brussels|cabbage|celery|greens|salad|avocado/i;
const DAIRY_RE = /cheese|yogurt|milk|cream|butter/i;

function pickTime(ingredients, base) {
  return ingredients.length > 6 ? base + 5 : base;
}

function buildDeterministicRecipe(mealName, ingredients = []) {
  const protein = ingredients.filter(i => PROTEIN_RE.test(i));
  const carb = ingredients.filter(i => CARB_RE.test(i));
  const veg = ingredients.filter(i => VEG_RE.test(i));
  const dairy = ingredients.filter(i => DAIRY_RE.test(i));
  const other = ingredients.filter(i => !PROTEIN_RE.test(i) && !CARB_RE.test(i) && !VEG_RE.test(i) && !DAIRY_RE.test(i));

  const steps = [];
  steps.push(`Step 1: Gather and prep all ingredients — ${ingredients.join(', ')}.`);

  let stepNum = 2;
  if (protein.length) {
    steps.push(`Step ${stepNum++}: Season ${protein.join(' and ')} with salt and pepper. Cook in a pan over medium-high heat until fully cooked through (about 6-8 minutes per side, or until internal temperature is safe for the protein used).`);
  }
  if (carb.length) {
    steps.push(`Step ${stepNum++}: Prepare ${carb.join(' and ')} according to package instructions.`);
  }
  if (veg.length) {
    steps.push(`Step ${stepNum++}: Sauté, steam, or roast ${veg.join(' and ')} until tender, about 5-7 minutes.`);
  }
  if (dairy.length) {
    steps.push(`Step ${stepNum++}: Add ${dairy.join(' and ')} and stir or melt in as needed.`);
  }
  if (other.length) {
    steps.push(`Step ${stepNum++}: Add remaining ingredients (${other.join(', ')}) and season to taste.`);
  }
  steps.push(`Step ${stepNum++}: Combine everything together, plate, and serve warm.`);

  return {
    prep_time: `${pickTime(ingredients, 10)} min`,
    cook_time: `${pickTime(ingredients, 15)} min`,
    steps,
  };
}

module.exports = { buildDeterministicRecipe };

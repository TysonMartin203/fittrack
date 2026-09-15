-- Run in Railway's MySQL "Data" console, ONE AT A TIME.

-- 1. Store the individual ingredient/item breakdown for a logged meal (name +
-- optional calories/macros per item). The existing calories/protein/carbs/fat
-- columns stay as-is and still hold the totals for fast summing in the
-- calorie tracker — this is purely additive, for the editable per-item UI.
ALTER TABLE LoggedMeals ADD COLUMN ingredients JSON NULL;

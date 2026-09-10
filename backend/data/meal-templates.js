function day(name, meals) { return { day: name, meals }; }
function meal(type, name, cal, p, c, f, ingredients) {
  return { type, name, calories: cal, protein: p, carbs: c, fat: f, ingredients, can_substitute: true };
}

const TEMPLATES = [
  {
    id: 'classic-bulk',
    name: 'Classic Bulk',
    description: 'High-calorie muscle-building plan built around chicken, rice, and eggs',
    category: 'Muscle Gain',
    icon: '💪',
    plan: {
      daily_calories: 3000,
      macros: { protein: 220, carbs: 320, fat: 85 },
      budget_tip: 'Buy chicken thighs in bulk and cook a big batch of rice at the start of the week',
      days: [
        day('Monday',[
          meal('Breakfast','Scrambled Eggs & Oatmeal',620,42,72,18,['4 large eggs','1.5 cups oats','1 cup milk','1 banana','1 tbsp peanut butter']),
          meal('Lunch','Chicken Rice Bowl',750,55,88,18,['7 oz chicken breast','1.5 cups white rice','1 cup broccoli','2 tbsp soy sauce','1 tsp sesame oil']),
          meal('Snack','Cottage Cheese & Fruit',320,28,36,6,['1.5 cups cottage cheese','1 cup mixed berries','1 tbsp honey']),
          meal('Dinner','Ground Beef Pasta',780,52,82,24,['6 oz lean ground beef','2 cups pasta','1 cup marinara sauce','2 tbsp parmesan','1 clove garlic']),
        ]),
        day('Tuesday',[
          meal('Breakfast','Protein Pancakes',580,40,68,14,['1 cup oat flour','2 eggs','1 cup milk','1 tbsp butter','maple syrup']),
          meal('Lunch','Turkey & Avocado Wrap',700,50,72,22,['6 oz deli turkey','2 flour tortillas','1 avocado','lettuce','tomato','mustard']),
          meal('Snack','Greek Yogurt Parfait',350,30,42,7,['1.5 cups Greek yogurt','1 cup granola','1 cup strawberries']),
          meal('Dinner','Salmon & Sweet Potato',820,58,80,26,['7 oz salmon fillet','2 medium sweet potatoes','1 cup green beans','2 tbsp olive oil','lemon','garlic']),
        ]),
        day('Wednesday',[
          meal('Breakfast','Breakfast Burrito',640,44,68,20,['3 eggs','2 flour tortillas','2 oz cheddar cheese','1/2 cup black beans','salsa','1/4 avocado']),
          meal('Lunch','Tuna Pasta Salad',720,52,80,18,['2 cans tuna','2 cups pasta','1/4 cup mayo','celery','red onion','pickles']),
          meal('Snack','PB Banana Rice Cakes',340,12,52,10,['4 rice cakes','3 tbsp peanut butter','2 bananas']),
          meal('Dinner','Chicken Stir Fry',780,58,78,22,['8 oz chicken breast','2 cups mixed vegetables','1.5 cups white rice','2 tbsp soy sauce','1 tbsp oyster sauce']),
        ]),
        day('Thursday',[
          meal('Breakfast','Eggs & Toast',560,38,58,18,['4 eggs','3 slices whole wheat toast','2 tbsp butter','1 cup orange juice']),
          meal('Lunch','Chicken Burrito Bowl',760,56,84,20,['7 oz grilled chicken','1.5 cups rice','1/2 cup black beans','corn','sour cream','cheese']),
          meal('Snack','Protein Shake & Banana',340,34,42,5,['2 scoops whey protein','1 cup milk','1 large banana','ice']),
          meal('Dinner','Beef & Potato',800,54,78,26,['7 oz sirloin steak','2 large potatoes','1 cup asparagus','2 tbsp butter','garlic','rosemary']),
        ]),
        day('Friday',[
          meal('Breakfast','Overnight Oats',600,40,72,16,['1.5 cups oats','1.5 cups milk','2 tbsp chia seeds','1/2 cup blueberries','honey']),
          meal('Lunch','Chicken Caesar Wrap',720,52,70,24,['7 oz grilled chicken','2 flour tortillas','romaine lettuce','caesar dressing','parmesan']),
          meal('Snack','Nuts & Cheese',360,20,18,26,['1/4 cup mixed nuts','3 oz cheddar cheese','1 apple']),
          meal('Dinner','Turkey Meatballs & Pasta',780,58,80,22,['7 oz ground turkey','2 cups pasta','1 cup marinara','parmesan','Italian herbs']),
        ]),
        day('Saturday',[
          meal('Breakfast','Big Breakfast',660,48,58,26,['4 eggs','3 strips bacon','2 slices toast','1 cup hashbrowns']),
          meal('Lunch','Grilled Chicken Sandwich',700,54,68,22,['7 oz chicken breast','brioche bun','lettuce','tomato','avocado','mayo']),
          meal('Snack','Smoothie',360,28,50,8,['1.5 scoops protein powder','1 cup frozen mango','1 banana','1/2 cup milk']),
          meal('Dinner','Pork Tenderloin & Rice',800,58,78,24,['8 oz pork tenderloin','1.5 cups rice','roasted vegetables','2 tbsp olive oil','garlic']),
        ]),
        day('Sunday',[
          meal('Breakfast','French Toast',600,36,72,18,['4 slices thick bread','3 eggs','1/2 cup milk','vanilla','maple syrup']),
          meal('Lunch','Burger & Fries',740,50,60,32,['7 oz beef patty','burger bun','cheddar cheese','lettuce','tomato','oven fries']),
          meal('Snack','Cottage Cheese Bowl',330,30,36,6,['1.5 cups cottage cheese','1 cup pineapple','1 tbsp honey']),
          meal('Dinner','Roast Chicken & Veggies',820,60,72,28,['8 oz chicken thighs','roasted potatoes','carrots','olive oil','rosemary','garlic']),
        ]),
      ],
    },
  },
  {
    id: 'clean-cut',
    name: 'Clean Cut',
    description: 'Lean calorie-deficit plan to lose fat while keeping your muscle',
    category: 'Fat Loss',
    icon: '🔥',
    plan: {
      daily_calories: 1800,
      macros: { protein: 170, carbs: 160, fat: 55 },
      budget_tip: 'Frozen vegetables are just as nutritious as fresh and much cheaper',
      days: [
        day('Monday',[
          meal('Breakfast','Egg White Omelette',360,32,28,10,['5 egg whites','1 whole egg','1 cup spinach','mushrooms','2 oz feta','1 slice whole wheat toast']),
          meal('Lunch','Grilled Chicken Salad',420,42,22,14,['6 oz chicken breast','large mixed greens','cucumber','tomato','red onion','2 tbsp vinaigrette']),
          meal('Snack','Apple & Almonds',220,6,28,9,['1 large apple','1 oz almonds']),
          meal('Dinner','Baked Cod & Veggies',480,46,36,12,['7 oz cod fillet','1 cup quinoa','zucchini','bell peppers','lemon','herbs']),
        ]),
        day('Tuesday',[
          meal('Breakfast','Greek Yogurt Bowl',340,30,38,6,['1 cup non-fat Greek yogurt','1/2 cup berries','2 tbsp granola','1 tsp honey']),
          meal('Lunch','Turkey Lettuce Wraps',400,40,20,14,['6 oz ground turkey','butter lettuce cups','tomato','avocado','lime juice','cumin']),
          meal('Snack','Protein Shake',200,28,12,3,['1.5 scoops whey protein','1 cup almond milk','ice']),
          meal('Dinner','Shrimp & Cauliflower Rice',480,46,30,14,['8 oz shrimp','2 cups cauliflower rice','frozen peas','soy sauce','ginger','garlic']),
        ]),
        day('Wednesday',[
          meal('Breakfast','Veggie Scramble & Toast',360,28,32,12,['3 eggs','bell pepper','onion','spinach','1 slice whole wheat toast']),
          meal('Lunch','Tuna Stuffed Peppers',400,44,18,12,['2 cans tuna','2 tbsp light mayo','celery','2 large bell peppers']),
          meal('Snack','Cucumber & Hummus',180,6,18,8,['2 cups sliced cucumber','4 tbsp hummus']),
          meal('Dinner','Chicken Soup',480,46,34,12,['7 oz chicken breast','chicken broth','carrots','celery','onion','1/2 cup egg noodles']),
        ]),
        day('Thursday',[
          meal('Breakfast','Overnight Oats Light',360,26,48,8,['1 cup oats','1 cup almond milk','1 tbsp chia seeds','1/2 cup strawberries']),
          meal('Lunch','Salmon Power Bowl',440,44,28,16,['5 oz salmon','1/2 cup brown rice','edamame','cucumber','avocado','soy sauce']),
          meal('Snack','Hard Boiled Eggs',160,12,1,10,['2 hard boiled eggs','salt and pepper']),
          meal('Dinner','Turkey Chili',500,46,40,10,['7 oz ground turkey','canned tomatoes','kidney beans','onion','chili powder','cumin']),
        ]),
        day('Friday',[
          meal('Breakfast','Green Smoothie',320,26,38,6,['1.5 scoops protein powder','1 cup spinach','1/2 banana','1/2 cup berries','almond milk']),
          meal('Lunch','Chicken & Veggie Stir Fry',420,44,28,12,['6 oz chicken breast','broccoli','snap peas','carrots','soy sauce','cauliflower rice']),
          meal('Snack','Celery & Peanut Butter',200,7,14,12,['4 stalks celery','2 tbsp natural peanut butter']),
          meal('Dinner','Baked Tilapia & Asparagus',500,48,34,12,['7 oz tilapia','12 asparagus spears','1/2 cup brown rice','lemon','garlic','olive oil']),
        ]),
        day('Saturday',[
          meal('Breakfast','Cottage Cheese Bowl',340,32,32,8,['1 cup low-fat cottage cheese','1/2 cup pineapple','1/4 cup walnuts','cinnamon']),
          meal('Lunch','Kale Chicken Salad',420,44,20,16,['7 oz chicken breast','kale','cherry tomatoes','feta','balsamic vinaigrette']),
          meal('Snack','Rice Cake & Avocado',200,4,24,9,['2 rice cakes','1/2 avocado','red pepper flakes','lime']),
          meal('Dinner','Lean Beef Tacos',500,44,38,14,['6 oz lean ground beef','corn tortillas','shredded lettuce','tomato','salsa','lime']),
        ]),
        day('Sunday',[
          meal('Breakfast','Veggie Omelette',360,30,20,18,['3 whole eggs','1 egg white','spinach','mushrooms','tomato','1 oz goat cheese']),
          meal('Lunch','Mediterranean Bowl',440,36,42,14,['5 oz grilled chicken','1/2 cup quinoa','cucumber','tomato','olives','tzatziki']),
          meal('Snack','Protein Yogurt',200,18,20,3,['3/4 cup non-fat Greek yogurt','1/2 cup berries']),
          meal('Dinner','Herb Baked Chicken & Salad',500,50,26,18,['7 oz chicken breast','large green salad','cherry tomatoes','olive oil dressing','whole grain roll']),
        ]),
      ],
    },
  },
  {
    id: 'budget-basics',
    name: 'Budget Basics',
    description: 'Under $60/week — eggs, beans, oats, and chicken thighs carry the whole plan',
    category: 'Budget',
    icon: '💰',
    plan: {
      daily_calories: 2200,
      macros: { protein: 155, carbs: 255, fat: 62 },
      budget_tip: 'Chicken thighs cost half as much as breasts. Cook a big pot of beans from dry — 10x cheaper than canned.',
      days: [
        day('Monday',[
          meal('Breakfast','Oatmeal with PB & Banana',420,16,64,12,['1.5 cups rolled oats','2 tbsp peanut butter','1 banana','1 cup milk','pinch of salt']),
          meal('Lunch','Egg Fried Rice',520,24,72,16,['3 eggs','1.5 cups rice','frozen peas and carrots','soy sauce','sesame oil','green onion']),
          meal('Snack','Peanut Butter Banana',240,7,32,10,['2 tbsp peanut butter','1 large banana']),
          meal('Dinner','Chicken Thigh & Beans',620,50,58,18,['2 chicken thighs','1 cup black beans','1 cup rice','garlic','cumin','lime']),
        ]),
        day('Tuesday',[
          meal('Breakfast','Scrambled Eggs & Toast',400,24,42,14,['3 eggs','2 slices bread','1 tbsp butter','salt and pepper']),
          meal('Lunch','Bean & Cheese Quesadilla',540,28,64,18,['1 cup black beans','2 flour tortillas','2 oz cheddar cheese','salsa']),
          meal('Snack','Apple & Peanut Butter',240,7,32,10,['1 apple','2 tbsp peanut butter']),
          meal('Dinner','Pasta with Meat Sauce',640,44,72,18,['4 oz ground beef','2 cups pasta','canned tomatoes','garlic','Italian seasoning']),
        ]),
        day('Wednesday',[
          meal('Breakfast','Oatmeal & Boiled Eggs',440,26,58,14,['1 cup oats','2 hard boiled eggs','1 tbsp honey','cinnamon','milk']),
          meal('Lunch','Tuna Sandwich',480,36,50,12,['1 can tuna','2 tbsp mayo','2 slices bread','lettuce','tomato','pickle']),
          meal('Snack','Crackers & Cheese',260,10,26,12,['8 crackers','2 oz cheddar cheese']),
          meal('Dinner','Chicken Thigh Stir Fry',620,50,64,18,['2 chicken thighs','2 cups frozen mixed vegetables','1.5 cups rice','soy sauce','garlic']),
        ]),
        day('Thursday',[
          meal('Breakfast','Peanut Butter Oatmeal',420,16,60,14,['1.5 cups oats','2 tbsp peanut butter','1 banana','honey','milk']),
          meal('Lunch','Lentil Soup',500,28,70,10,['1 cup lentils','chicken broth','carrots','celery','onion','cumin','garlic','bread']),
          meal('Snack','Boiled Eggs',140,12,1,9,['2 boiled eggs','salt']),
          meal('Dinner','Beef & Potato Hash',620,42,62,20,['5 oz ground beef','2 potatoes','onion','bell pepper','garlic','paprika']),
        ]),
        day('Friday',[
          meal('Breakfast','French Toast',420,18,56,14,['3 slices bread','2 eggs','1/2 cup milk','cinnamon','maple syrup']),
          meal('Lunch','Chicken Wrap',520,44,52,14,['leftover chicken thigh','1 flour tortilla','shredded cabbage','carrots','mayo','hot sauce']),
          meal('Snack','Yogurt & Banana',240,12,38,4,['1 cup plain yogurt','1 banana','honey']),
          meal('Dinner','Bean Chili',640,34,82,14,['1 cup kidney beans','1 cup black beans','canned tomatoes','4 oz ground beef','chili spices','cheese']),
        ]),
        day('Saturday',[
          meal('Breakfast','Breakfast Burritos',480,28,54,18,['3 eggs','1 flour tortilla','black beans','salsa','cheese']),
          meal('Lunch','Fried Rice',500,20,72,14,['2 cups rice','2 eggs','frozen peas and carrots','soy sauce','green onion','sesame oil']),
          meal('Snack','Peanut Butter Toast',260,9,30,12,['2 slices bread','2 tbsp peanut butter']),
          meal('Dinner','Roast Chicken Thighs & Veggies',640,52,56,20,['2 chicken thighs','potatoes','carrots','onion','olive oil','garlic','rosemary']),
        ]),
        day('Sunday',[
          meal('Breakfast','Omelette & Toast',380,24,30,18,['3 eggs','onion','bell pepper','cheese','2 slices toast']),
          meal('Lunch','Bean Tacos',500,24,68,14,['1 cup refried beans','3 corn tortillas','cheese','shredded cabbage','salsa','lime']),
          meal('Snack','Crackers & Peanut Butter',260,9,28,12,['8 crackers','2 tbsp peanut butter']),
          meal('Dinner','Chicken Soup',620,46,60,14,['leftover chicken thigh','chicken broth','egg noodles','carrots','celery','onion','garlic']),
        ]),
      ],
    },
  },
];

module.exports = TEMPLATES;

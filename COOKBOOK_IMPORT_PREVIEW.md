# CookBook Import Preview - Transformation Examples

## 📊 What Will Happen

### Recipe Count
- **Total YAML files:** 236 recipes
- **Test import:** 5 recipes first
- **Full import:** All 236 after test success

---

## 🔄 Transformation Examples

### Example 1: Greek Salad (No Image)

#### Input (YAML):
```yaml
name: Greek Salad
servings: 2 servings
ingredients:
  - 1 Lettuce
  - 1 Tomatoes
  - 1 Cucumber
  - 1 Red onion
  - 1 Feta or Bulgarit
  - 1 Kalamata or black olives
  - 1 Olive oil
  - 1 Lemon juice
tags:
  - Salad
  - Vegetables
```

#### Output (MongoDB):
```javascript
{
  mealName: "Greek Salad",
  description: "",
  ingredients: [
    "Lettuce",                    // ✅ "1" removed, Title Case
    "Tomatoes",                   // ✅ "1" removed
    "Cucumber",                   // ✅ "1" removed
    "Red Onion",                  // ✅ Title Case
    "Feta Or Bulgarit",          // ✅ Title Case
    "Kalamata Or Black Olives",  // ✅ Title Case
    "Olive Oil",                  // ✅ Title Case
    "Lemon Juice"                 // ✅ Title Case
  ],
  tags: [],                       // ✅ Empty (not used)
  cookbookTags: ["Salad", "Vegetables"],  // ✅ Stored in DB only
  instructions: "",               // ✅ Not migrated
  imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg",  // ✅ Default image
  prepTime: 0,
  cookTime: 0,
  servings: 2,                    // ✅ Extracted from "2 servings"
  category: "Other",
  owner: "default",
  confirmed: true
}
```

---

### Example 2: Chocolate Chip Cookie Dough Pots (With Image)

#### Input (YAML):
```yaml
name: Chocolate chip cookie dough pots
servings: 6 servings
source: Simply Nigela
image: https://media.cookbookmanager.com/17874/VfEJR6IHhjigRlfEMx0HYm2ERAy9uvJM8OqP31QEp8Usil0BMDwrAWkHXKiwMPV9.jpg
prep_time: PT15M
cook_time: PT13M
notes: "6 ramekins 8cm diameter"
tags:
  - Baked Goods
  - Dairy
  - Chocolate
ingredients:
  - 150 g plain flour
  - 0.5 tsp fine sea salt
  - 110 g soft unsalted butter
  - 85 g soft light brown sugar
  - 1 teaspoon vanilla paste
  - 170 g dark chocolate chips
directions:
  - Preheat the oven to 180°C...
  - Divide the dough between 6 ramekins...
```

#### Output (MongoDB):
```javascript
{
  mealName: "Chocolate chip cookie dough pots",
  description: "6 ramekins 8cm diameter",  // ✅ From notes
  ingredients: [
    "Plain Flour",           // ✅ "150 g" removed, Title Case
    "Fine Sea Salt",         // ✅ "0.5 tsp" removed, Title Case
    "Soft Unsalted Butter",  // ✅ "110 g" removed, Title Case
    "Soft Light Brown Sugar",// ✅ "85 g" removed, Title Case
    "Vanilla Paste",         // ✅ "1 teaspoon" removed, Title Case
    "Dark Chocolate Chips"   // ✅ "170 g" removed, Title Case
  ],
  tags: [],                   // ✅ Empty
  cookbookTags: ["Baked Goods", "Dairy", "Chocolate"],  // ✅ Stored in DB
  instructions: "",           // ✅ NOT migrated (per user request)
  imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1234567/cookbook-imports/chocolate-chip-cookie-dough-pots.jpg",  // ✅ Downloaded & uploaded to YOUR Cloudinary
  prepTime: 15,              // ✅ PT15M → 15 minutes
  cookTime: 13,              // ✅ PT13M → 13 minutes
  servings: 6,               // ✅ "6 servings" → 6
  category: "Other",
  owner: "default",
  confirmed: true
}
```

---

### Example 3: Grilled Peach Salad (Complex Ingredients)

#### Input (YAML):
```yaml
name: Grilled Peach & Burrata Salad with Honey-Balsamic Vinaigrette
ingredients:
  - 2 ripe peaches, halved and pitted
  - 1 tbsp olive oil
  - 1 ball burrata cheese
  - 3 cups arugula or mixed greens
  - ¼ cup toasted pine nuts
  - "For the honey-balsamic vinaigrette:"
  - 2 tbsp balsamic vinegar
  - 1 tbsp honey
  - ¼ cup extra virgin olive oil
```

#### Output (MongoDB):
```javascript
{
  ingredients: [
    "Ripe Peaches",              // ✅ "2" and "halved and pitted" kept, numbers removed
    "Olive Oil",                 // ✅ "1 tbsp" removed
    "Burrata Cheese",            // ✅ "1 ball" removed  
    "Arugula Or Mixed Greens",   // ✅ "3 cups" removed, Title Case
    "Toasted Pine Nuts",         // ✅ "¼ cup" removed
    "For The Honey-Balsamic Vinaigrette:",  // ✅ Section headers kept
    "Balsamic Vinegar",          // ✅ "2 tbsp" removed
    "Honey",                     // ✅ "1 tbsp" removed
    "Extra Virgin Olive Oil"     // ✅ "¼ cup" removed
  ]
}
```

---

## 🎯 Key Changes Summary

### ✅ What WILL Be Migrated:
- Meal names (exact)
- Ingredients (cleaned, Title Case)
- Images (downloaded & uploaded to YOUR Cloudinary)
- Prep/cook times (parsed to minutes)
- Servings (extracted number)
- Notes (to description field)
- CookBook tags (to cookbookTags field - DB only)

### ❌ What WON'T Be Migrated:
- Directions/Instructions (skipped per your request)
- Source/nutrition info (optional, can add later)

### 🔧 What Gets Transformed:
- Ingredients: Numbers removed, Title Case applied
- Times: ISO 8601 (PT10M) → minutes (10)
- Servings: "2 servings" → 2
- Images: CookBook URL → YOUR Cloudinary URL
- Tags: Moved to cookbookTags field

---

## 📸 Image Migration Details

**For ~100 recipes with images:**
1. Download from: `https://media.cookbookmanager.com/...`
2. Upload to: `https://res.cloudinary.com/meal-creator/image/upload/cookbook-imports/...`
3. Auto optimize: WebP/AVIF, 800x800 max, auto quality
4. If download fails: Use default image

**For ~136 recipes without images:**
- Use default: `meal-images/untitled-meal.jpg`

---

## 🧪 Test Mode

**First Run (TEST_MODE = true):**
- Import only 5 recipes
- Verify transformations
- Check image uploads
- Confirm data looks good

**Second Run (TEST_MODE = false):**
- Import all 236 recipes
- Full migration

---

## 🎨 How It Will Look in Your App

### On Meals Page:
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ [Cloudinary Image]      │  │ [Default Image]         │
│                         │  │                         │
│ Chocolate Chip Cookies  │  │ Greek Salad             │
│                         │  │                         │
│ (no tags shown)         │  │ (no tags shown)         │
└─────────────────────────┘  └─────────────────────────┘
```

### When Viewing Recipe:
```
Chocolate Chip Cookie Dough Pots
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prep: 15 min | Cook: 13 min | Servings: 6

Ingredients:
• Plain Flour
• Fine Sea Salt
• Soft Unsalted Butter
• Soft Light Brown Sugar
• Vanilla Paste
• Dark Chocolate Chips

Instructions:
(empty - you can add later)

Tags:
(empty - you can add your own tags later)

CookBook Tags (in DB, not shown):
["Baked Goods", "Dairy", "Chocolate"]
```

---

## ⚡ Performance

**Image Loading:**
- ✅ Uses Next.js `CldImage` component
- ✅ Auto WebP/AVIF conversion
- ✅ Lazy loading
- ✅ CDN delivery (fast worldwide)
- ✅ Responsive sizing
- ✅ Placeholder blur

**Same fast loading as your current meals!**

---

## 🚀 How to Run

**Test Import (5 recipes):**
```bash
npm run import-cookbook
```

**Full Import (all 236):**
Edit `scripts/import-cookbook-recipes.ts`:
```typescript
const TEST_MODE = false;  // Change to false
```
Then run: `npm run import-cookbook`

---

## ⚠️ Important Notes

1. **Database Only:** cookbookTags stored but NOT displayed in UI yet
2. **No Directions:** Instructions field will be empty
3. **Ingredients:** Only ingredient names, no quantities
4. **Images:** All on YOUR Cloudinary for fast loading
5. **Duplicates:** Skipped automatically (won't overwrite)

---

**Ready to test with 5 recipes?**



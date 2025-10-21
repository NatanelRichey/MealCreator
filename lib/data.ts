import { Meal, PantryItem, ShoppingListItem } from './types';

// ==============================================
// PANTRY & SHOPPING LIST CONSTANTS
// ==============================================

// All available pantry categories
export const PANTRY_CATEGORIES = [
    "Vegetables",
    "Fruits", 
    "Grains Pasta",
    "Dairy",
    "Meat Poultry",
    "Fish Eggs",
    "Fats Oils",
    "Condiments",
    "Freezer",
    "Baking",
    "Nuts Snacks",
    "Miscellaneous",
    "Saved Items"
] as const;

// Display names for two-word categories (with ampersands)
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    "Grains Pasta": "Grains & Pasta",
    "Fish Eggs": "Fish & Eggs",
    "Fats Oils": "Fats & Oils",
    "Meat Poultry": "Meat & Poultry",
    "Nuts Snacks": "Nuts & Snacks"
};

// ==============================================
// MEAL CONSTANTS
// ==============================================

// Meal categories
export const MEAL_CATEGORIES = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
    "Other"
] as const;

// Health-related tags
export const HEALTH_TAGS = ["healthy", "regular"] as const;

// Meal time tags
export const MEAL_TIME_TAGS = ["breakfast", "lunch", "dinner"] as const;

// Dietary/genre tags
export const DIETARY_TAGS = ["dairy", "parve", "meaty"] as const;

// All available tags combined
export const ALL_TAGS = [
    ...HEALTH_TAGS,
    ...MEAL_TIME_TAGS,
    ...DIETARY_TAGS
] as const;

// ==============================================
// MEASUREMENT UNITS
// ==============================================

export const MEASUREMENT_UNITS: string[] = [
    "cup",
    "cups",
    "tbsp",
    "tsp",
    "oz",
    "lb",
    "lbs",
    "g",
    "kg",
    "ml",
    "l",
    "piece",
    "pieces",
    "can",
    "package"
];

// ==============================================
// DEFAULT VALUES
// ==============================================

// Default meal image URL
export const DEFAULT_MEAL_IMAGE: string = 
    "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg";

// Default meal object (for forms/initialization)
export const DEFAULT_MEAL: Omit<Meal, '_id' | 'owner' | 'createdAt'> = {
    mealName: '',
    description: '',
    ingredients: [],
    tags: [],
    instructions: '',
    imgSrc: DEFAULT_MEAL_IMAGE,
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    category: 'Other',
    confirmed: false
};

// Default pantry item object (for forms/initialization)
export const DEFAULT_PANTRY_ITEM: Omit<PantryItem, '_id' | 'owner' | 'addedDate'> = {
    name: '',
    category: 'Miscellaneous',
    inStock: true,
    quantity: 1,
    unit: ''
};

// Default shopping list item object (for forms/initialization)
export const DEFAULT_SHOPPING_LIST_ITEM: Omit<ShoppingListItem, '_id' | 'owner' | 'addedDate'> = {
    name: '',
    category: 'Miscellaneous',
    inStock: false,
    checked: false,
    quantity: 1,
    unit: ''
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Get display name for a category (with ampersands if applicable)
 * @param category - The category name
 * @returns The formatted display name
 */
export function getCategoryDisplayName(category: string): string {
    return CATEGORY_DISPLAY_NAMES[category] || category;
}

/**
 * Sort tags into health, meal time, and dietary categories
 * @param tags - Array of tag strings
 * @returns Object with categorized tags
 */
export function sortTags(tags: string[]): {
    healthTags: string[];
    mealTags: string[];
    genreTags: string[];
} {
    return {
        healthTags: tags.filter(tag => 
            HEALTH_TAGS.includes(tag.toLowerCase() as typeof HEALTH_TAGS[number])
        ),
        mealTags: tags.filter(tag => 
            MEAL_TIME_TAGS.includes(tag.toLowerCase() as typeof MEAL_TIME_TAGS[number])
        ),
        genreTags: tags.filter(tag => 
            DIETARY_TAGS.includes(tag.toLowerCase() as typeof DIETARY_TAGS[number])
        )
    };
}

/**
 * Get icon URL for a category
 * @param category - The category name
 * @returns Cloudinary URL for the category icon
 */
export function getCategoryIconUrl(category: string): string {
    const categoryLower = category.toLowerCase().replace(' ', '');
    return `https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/${categoryLower}.png`;
}


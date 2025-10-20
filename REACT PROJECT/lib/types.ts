// ==============================================
// TYPE DEFINITIONS
// ==============================================
// These define the structure of our data
// TypeScript will warn us if we try to use data incorrectly

// Meal object type
export interface Meal {
    _id?: string;  // MongoDB ID (optional for new meals)
    mealName: string;
    description: string;
    ingredients: string[];
    tags: string[];
    instructions: string;
    imgSrc: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    category: string;
    owner: string;
    confirmed: boolean;
    createdAt: Date | string;  // Can be Date object or ISO string from API
}

// Pantry item type
export interface PantryItem {
    _id?: string;  // MongoDB ID (optional for new items)
    name: string;
    category: string;
    owner: string;
    inStock: boolean;
    quantity: number;
    unit: string;
    addedDate: Date | string;
}

// Shopping list item type
export interface ShoppingListItem {
    _id?: string;  // MongoDB ID (optional for new items)
    name: string;
    category: string;
    owner: string;
    inStock: boolean;
    checked: boolean;
    quantity: number;
    unit: string;
    addedDate: Date | string;
}

// User type
export interface User {
    _id?: string;  // MongoDB ID
    username: string;
    email: string;
}

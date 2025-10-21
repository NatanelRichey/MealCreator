// API helper functions to connect React frontend to Next.js API routes
// In development: Next.js dev server on http://localhost:3001
// In production: Same-origin (no need to specify URL)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    credentials: 'include', // Include cookies for session authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses (like redirects)
    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Handle HTML responses (like redirects)
      return { success: true, redirect: true };
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ============================================================================
// MEALS API
// ============================================================================

export interface Meal {
  _id?: string;
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
  createdAt: Date | string;
}

export interface CreateMealData {
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
}

// Get all meals for current user
export async function getMeals(): Promise<Meal[]> {
  const user = getCurrentUser();
  if (!user) {
    console.error('No user logged in');
    return [];
  }
  
  const response = await apiRequest(`/api/meals?username=${user.username}`);
  return response?.meals || [];
}

// Create a new meal
export async function createMeal(mealData: CreateMealData): Promise<Meal> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  const response = await apiRequest('/api/meals', {
    method: 'POST',
    body: JSON.stringify({ ...mealData, owner: user.username }),
  });
  
  return response.meal;
}

// Update an existing meal
export async function updateMeal(mealId: string, mealData: Partial<CreateMealData>): Promise<Meal> {
  const response = await apiRequest(`/api/meals/${mealId}`, {
    method: 'PUT',
    body: JSON.stringify(mealData),
  });
  
  return response.meal;
}

// Delete a meal
export async function deleteMeal(mealId: string): Promise<void> {
  await apiRequest(`/api/meals/${mealId}`, {
    method: 'DELETE',
  });
}

// Get a single meal by ID
export async function getMeal(mealId: string): Promise<Meal> {
  const response = await apiRequest(`/api/meals/${mealId}`);
  return response.meal;
}

// Find meals based on preferences
export async function findMeals(preferences: {
  health: string;
  mealtime: string;
  genre: string;
}): Promise<Meal[]> {
  const user = getCurrentUser();
  if (!user) {
    console.error('No user logged in');
    return [];
  }
  
  const response = await apiRequest('/api/meals/find', {
    method: 'POST',
    body: JSON.stringify({ ...preferences, owner: user.username }),
  });
  return response?.meals || [];
}

// Get surprise meals (matches all tags with available ingredients)
export async function getSurpriseMeals(): Promise<Meal[]> {
  const user = getCurrentUser();
  if (!user) {
    console.error('No user logged in');
    return [];
  }
  
  const response = await apiRequest('/api/meals/find', {
    method: 'POST',
    body: JSON.stringify({ owner: user.username, surprise: true }),
  });
  return response?.meals || [];
}

// ============================================================================
// PANTRY API
// ============================================================================

export interface PantryItem {
  _id?: string;
  name: string;
  category: string;
  owner: string;
  createdAt: Date | string;
}

export interface PantryData {
  categories: {
    [category: string]: PantryItem[];
  };
  savedItems: PantryItem[];
}

// Get pantry data
export async function getPantry(): Promise<PantryData> {
  const user = getCurrentUser();
  if (!user) {
    console.error('No user logged in');
    return { categories: {}, savedItems: [] };
  }
  
  const response = await apiRequest(`/api/pantry?username=${user.username}`);
  return response || { categories: {}, savedItems: [] };
}

// Add item to pantry
export async function addPantryItem(category: string, itemName: string): Promise<PantryItem> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  const response = await apiRequest('/api/pantry', {
    method: 'POST',
    body: JSON.stringify({ 
      name: itemName, 
      category, 
      owner: user.username 
    }),
  });
  
  return response.item;
}

// Move item to saved items
export async function moveToSavedItems(itemName: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  await apiRequest('/api/pantry/actions', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'move-to-saved', 
      name: itemName, 
      owner: user.username 
    }),
  });
}

// Move item from saved items back to category
export async function moveFromSavedItems(itemName: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  await apiRequest('/api/pantry/actions', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'move-from-saved', 
      name: itemName, 
      owner: user.username 
    }),
  });
}

// Move item to shopping cart
export async function moveToCart(itemName: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  await apiRequest('/api/pantry/actions', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'move-to-cart', 
      name: itemName, 
      owner: user.username 
    }),
  });
}

// Edit pantry item name
export async function editPantryItem(itemId: string, newName: string): Promise<void> {
  await apiRequest(`/api/pantry/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ name: newName }),
  });
}

// Delete pantry item
export async function deletePantryItem(itemId: string): Promise<void> {
  await apiRequest(`/api/pantry/${itemId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// SHOPPING LIST API
// ============================================================================

export interface ShoppingListItem {
  _id?: string;
  name: string;
  category: string;
  owner: string;
  createdAt: Date | string;
}

export interface ShoppingListData {
  categories: {
    [category: string]: ShoppingListItem[];
  };
}

// Get shopping list data
export async function getShoppingList(): Promise<ShoppingListData> {
  const user = getCurrentUser();
  if (!user) {
    console.error('No user logged in');
    return { categories: {} };
  }
  
  const response = await apiRequest(`/api/shopping-list?username=${user.username}`);
  return response || { categories: {} };
}

// Add item to shopping list
export async function addShoppingListItem(category: string, itemName: string): Promise<ShoppingListItem> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  const response = await apiRequest('/api/shopping-list', {
    method: 'POST',
    body: JSON.stringify({ 
      name: itemName, 
      category, 
      owner: user.username 
    }),
  });
  
  return response.item;
}

// Move item from shopping list to pantry
export async function moveToPantry(itemName: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user logged in');
  }
  
  await apiRequest('/api/shopping-list/actions', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'move-to-pantry', 
      name: itemName, 
      owner: user.username 
    }),
  });
}

// Edit shopping list item name
export async function editShoppingListItem(itemId: string, newName: string): Promise<void> {
  await apiRequest(`/api/shopping-list/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ name: newName }),
  });
}

// Delete shopping list item
export async function deleteShoppingListItem(itemId: string): Promise<void> {
  await apiRequest(`/api/shopping-list/${itemId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export interface User {
  _id: string;
  username: string;
  email: string;
}

// Login user (simplified - no password needed, just "default" or "demo")
export async function loginUser(username: string): Promise<{ success: boolean; user?: User }> {
  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });

    if (response && response.user) {
      // Store user in localStorage for client-side access
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return { success: true, user: response.user };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false };
  }
}

// Demo login (just logs in as "demo" user)
export async function demoLogin(): Promise<{ success: boolean; user?: User }> {
  return loginUser('demo');
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
    // Clear user from localStorage
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Logout error:', error);
    // Clear user from localStorage even if API call fails
    localStorage.removeItem('currentUser');
  }
}

// Get current logged-in user from localStorage
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

// Check if user is authenticated (check localStorage)
export async function checkAuth(): Promise<{ authenticated: boolean; user?: User }> {
  const user = getCurrentUser();
  if (user) {
    return { authenticated: true, user };
  }
  return { authenticated: false };
}

// ============================================================================
// APP NAVIGATION API
// ============================================================================
// Note: The old Express navigation functions (processMealSelection, processChoice)
// have been removed. Use findMeals() and getSurpriseMeals() instead.

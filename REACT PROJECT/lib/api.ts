// API helper functions to connect React frontend to Express backend
// Backend runs on http://localhost:3000 (or deployed URL)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  const response = await apiRequest('/api/meals');
  return response?.meals || [];
}

// Create a new meal
export async function createMeal(mealData: CreateMealData): Promise<Meal> {
  const response = await apiRequest('/api/meals/new', {
    method: 'POST',
    body: JSON.stringify(mealData),
  });
  
  return response.meal;
}

// Update an existing meal
export async function updateMeal(mealId: string, mealData: Partial<CreateMealData>): Promise<Meal> {
  const response = await apiRequest(`/api/meals/edit/${mealId}`, {
    method: 'PUT',
    body: JSON.stringify(mealData),
  });
  
  return response.meal;
}

// Delete a meal
export async function deleteMeal(mealId: string): Promise<void> {
  await apiRequest(`/api/meals/delete/${mealId}`, {
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
  const response = await apiRequest('/api/meals/find', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });
  return response?.meals || [];
}

// Get surprise meals (random)
export async function getSurpriseMeals(): Promise<Meal[]> {
  const response = await apiRequest('/api/meals/surprise');
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
  const response = await apiRequest('/api/pantry');
  return response || { categories: {}, savedItems: [] };
}

// Add item to pantry
export async function addPantryItem(category: string, itemName: string): Promise<void> {
  await apiRequest(`/api/pantry/add-item/${encodeURIComponent(category)}`, {
    method: 'POST',
    body: JSON.stringify({ name: itemName }),
  });
}

// Move item to saved items
export async function moveToSavedItems(itemName: string): Promise<void> {
  await apiRequest(`/api/pantry/move-to-saved/${encodeURIComponent(itemName)}`, {
    method: 'PUT',
  });
}

// Move item from saved items back to category
export async function moveFromSavedItems(itemName: string): Promise<void> {
  await apiRequest(`/api/pantry/move-from-saved/${encodeURIComponent(itemName)}`, {
    method: 'PUT',
  });
}

// Move item to shopping cart
export async function moveToCart(itemName: string): Promise<void> {
  await apiRequest(`/api/pantry/move-to-cart/${encodeURIComponent(itemName)}`, {
    method: 'PUT',
  });
}

// Edit pantry item name
export async function editPantryItem(itemId: string, newName: string): Promise<void> {
  await apiRequest(`/api/pantry/edit/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: newName }),
  });
}

// Delete pantry item
export async function deletePantryItem(itemId: string): Promise<void> {
  await apiRequest(`/api/pantry/delete/${itemId}`, {
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
  const response = await apiRequest('/api/shopping-list');
  return response || { categories: {} };
}

// Add item to shopping list
export async function addShoppingListItem(category: string, itemName: string): Promise<void> {
  await apiRequest(`/api/shopping-list/add-item/${encodeURIComponent(category)}`, {
    method: 'POST',
    body: JSON.stringify({ name: itemName }),
  });
}

// Move item from shopping list to pantry
export async function moveToPantry(itemName: string): Promise<void> {
  await apiRequest(`/api/shopping-list/move-to-pantry/${encodeURIComponent(itemName)}`, {
    method: 'PUT',
  });
}

// Edit shopping list item name
export async function editShoppingListItem(itemId: string, newName: string): Promise<void> {
  await apiRequest(`/api/shopping-list/edit/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: newName }),
  });
}

// Delete shopping list item
export async function deleteShoppingListItem(itemId: string): Promise<void> {
  await apiRequest(`/api/shopping-list/delete/${itemId}`, {
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

// Login user
export async function loginUser(username: string, password: string): Promise<{ success: boolean; user?: User }> {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (response.ok) {
    return { success: true };
  } else {
    return { success: false };
  }
}

// Demo login
export async function demoLogin(): Promise<{ success: boolean; user?: User }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demo-login`, {
      method: 'POST',
      credentials: 'include',
      redirect: 'manual', // Don't follow redirects automatically
    });

    // Express redirects on success (302/301)
    // If we get a redirect or 200, consider it success
    if (response.ok || response.type === 'opaqueredirect' || response.status === 302 || response.status === 301) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Demo login error:', error);
    return { success: false };
  }
}

// Register user
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    return { success: true };
  } else {
    const error = await response.text();
    return { success: false, error };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  await apiRequest('/logout', {
    method: 'GET',
  });
}

// Check if user is authenticated
export async function checkAuth(): Promise<{ authenticated: boolean; user?: User }> {
  try {
    const response = await apiRequest('/app');
    return { authenticated: true };
  } catch (error) {
    return { authenticated: false };
  }
}

// ============================================================================
// APP NAVIGATION API
// ============================================================================

// Process meal selection (from meal selector)
export async function processMealSelection(selections: {
  health: string;
  mealtime: string;
  genre: string;
}): Promise<void> {
  await apiRequest('/app/find-meals', {
    method: 'POST',
    body: JSON.stringify(selections),
  });
}

// Process choice (surprise me)
export async function processChoice(choice: string): Promise<void> {
  await apiRequest(`/app/choice/${choice}`, {
    method: 'GET',
  });
}

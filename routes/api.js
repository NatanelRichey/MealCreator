import express from 'express';
const router = express.Router();
import Pantry from '../models/pantry.js';
import ShoppingList from '../models/shopping-list.js';
import Meal from '../models/meal.js';
import User from '../models/user.js';
import { isLoggedIn } from '../middleware.js';

// ==============================================
// AUTH API ROUTES
// ==============================================

router.post('/demo-login', async (req, res) => {
    try {
        console.log('🔐 Demo login request received');
        console.log('📍 Origin:', req.headers.origin);
        console.log('🍪 Has session ID:', !!req.sessionID);
        console.log('👤 Current user before login:', req.user?.username || 'none');
        
        const demoUsername = 'demo';
        let demoUser = await User.findOne({ username: demoUsername });
        
        // If demo user doesn't exist, create it
        if (!demoUser) {
            console.log('👤 Creating new demo user...');
            demoUser = new User({ email: 'demo@mealcreator.com', username: demoUsername });
            await User.register(demoUser, 'demo123');
            
            // Seed demo data
            await seedDemoData(demoUsername);
        } else {
            console.log('👤 Demo user found in database');
        }
        
        // Check if demo data exists
        const pantryCount = await Pantry.countDocuments({ owner: demoUsername });
        console.log('📊 Pantry items count:', pantryCount);
        if (pantryCount === 0) {
            await seedDemoData(demoUsername);
        }
        
        // Log in the demo user
        req.login(demoUser, (err) => {
            if (err) {
                console.error('❌ Demo login error:', err);
                return res.status(500).json({ success: false, error: 'Login failed' });
            }
            console.log('✅ Demo user logged in successfully');
            console.log('🍪 Session ID after login:', req.sessionID);
            console.log('👤 Current user after login:', req.user.username);
            res.json({ success: true, user: { username: demoUser.username, email: demoUser.email } });
        });
    } catch (e) {
        console.error('❌ Demo login error:', e);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// Helper function to seed demo data
async function seedDemoData(demoUsername) {
    console.log('🌱 Starting to seed demo data for:', demoUsername);
    
    const pantryItems = [
        { name: "Tomatoes", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Onions", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Garlic", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Spinach", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Bell Peppers", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Broccoli", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Eggs", category: "Fish Eggs", owner: demoUsername, inStock: true },
        { name: "Chicken", category: "Meat Poultry", owner: demoUsername, inStock: true },
        { name: "Olive Oil", category: "Fats Oils", owner: demoUsername, inStock: true },
        { name: "Salt", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Pepper", category: "Condiments", owner: demoUsername, inStock: true }
    ];

    const shoppingListItems = [
        { name: "Lettuce", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Milk", category: "Dairy", owner: demoUsername, inStock: false }
    ];

    const meals = [
        { 
            mealName: "Healthy Breakfast Bowl", 
            ingredients: ["Eggs", "Spinach", "Tomatoes"], 
            tags: ["Healthy", "Breakfast", "Parve"], 
            imgSrc: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80", 
            instructions: "Scramble eggs with fresh spinach, top with diced tomatoes.", 
            owner: demoUsername, 
            confirmed: true, 
            prepTime: 5, 
            cookTime: 10, 
            servings: 2,
            category: "Breakfast",
            description: "A nutritious breakfast bowl"
        },
        { 
            mealName: "Garlic Chicken", 
            ingredients: ["Chicken", "Garlic", "Olive Oil", "Salt", "Pepper"], 
            tags: ["Regular", "Dinner", "Meaty"], 
            imgSrc: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80", 
            instructions: "Marinate chicken with garlic, salt, pepper. Pan fry in olive oil.", 
            owner: demoUsername, 
            confirmed: true, 
            prepTime: 10, 
            cookTime: 20, 
            servings: 3,
            category: "Dinner",
            description: "Simple garlic chicken"
        }
    ];

    try {
        console.log('🗑️  Clearing existing demo data...');
        await Pantry.deleteMany({ owner: demoUsername });
        await ShoppingList.deleteMany({ owner: demoUsername });
        await Meal.deleteMany({ owner: demoUsername });

        console.log('📦 Inserting pantry items...');
        await Pantry.insertMany(pantryItems);
        console.log('🛒 Inserting shopping list items...');
        await ShoppingList.insertMany(shoppingListItems);
        console.log('🍽️  Inserting meals...');
        await Meal.insertMany(meals);
        
        console.log(`✅ Demo data seeded successfully: ${pantryItems.length} pantry items, ${shoppingListItems.length} shopping items, ${meals.length} meals`);
    } catch (error) {
        console.error('❌ Error seeding demo data:', error);
        throw error;
    }
}

// ==============================================
// MEALS API ROUTES
// ==============================================

router.get('/meals', isLoggedIn, async (req, res) => {
    try {
        console.log('🍽️  GET /api/meals - Session ID:', req.sessionID);
        console.log('👤 User:', req.user?.username || 'NOT AUTHENTICATED');
        
        const curUsername = res.locals.currentUser.username;
        await Meal.deleteMany({ confirmed: false, owner: curUsername });
        const meals = await Meal.find({ owner: curUsername }).sort({ mealName: 1 });
        
        console.log('📊 Found', meals.length, 'meals for user:', curUsername);
        res.json({ meals });
    } catch (error) {
        console.error('❌ Error fetching meals:', error);
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
});

// Specific routes BEFORE :id route
router.post('/meals/new', isLoggedIn, async (req, res) => {
    try {
        const curUsername = res.locals.currentUser.username;
        const mealData = {
            ...req.body,
            owner: curUsername,
            confirmed: true,
            createdAt: new Date()
        };
        
        const newMeal = await Meal.create(mealData);
        res.json({ meal: newMeal });
    } catch (error) {
        console.error('Error creating meal:', error);
        res.status(500).json({ error: 'Failed to create meal' });
    }
});

router.delete('/meals/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        await Meal.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ error: 'Failed to delete meal' });
    }
});

router.put('/meals/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMeal = await Meal.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ meal: updatedMeal });
    } catch (error) {
        console.error('Error updating meal:', error);
        res.status(500).json({ error: 'Failed to update meal' });
    }
});

// Dynamic :id route LAST
router.get('/meals/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const meal = await Meal.findById(id);
        res.json({ meal });
    } catch (error) {
        console.error('Error fetching meal:', error);
        res.status(500).json({ error: 'Failed to fetch meal' });
    }
});

// Find meals based on preferences
router.post('/meals/find', isLoggedIn, async (req, res) => {
    try {
        const { health, mealtime, genre } = req.body;
        const curUsername = res.locals.currentUser.username;
        const choices = [health.toLowerCase(), mealtime.toLowerCase(), genre.toLowerCase()];
        
        const matchedMeals = await findMatchedMeal(choices, curUsername);
        res.json({ meals: matchedMeals });
    } catch (error) {
        console.error('Error finding meals:', error);
        res.status(500).json({ error: 'Failed to find meals' });
    }
});

// Surprise me - find 4 random meals you can make
router.get('/meals/surprise', isLoggedIn, async (req, res) => {
    try {
        const curUsername = res.locals.currentUser.username;
        const choices = ["healthy","regular","breakfast","lunch","dinner","dairy","parve","meaty"];
        
        const matchedMeals = await findMatchedMeal(choices, curUsername);
        
        // Randomly select up to 4 meals
        const shuffled = matchedMeals.sort(() => 0.5 - Math.random());
        const selectedMeals = shuffled.slice(0, 4);
        
        res.json({ meals: selectedMeals });
    } catch (error) {
        console.error('Error finding surprise meals:', error);
        res.status(500).json({ error: 'Failed to find meals' });
    }
});

// Helper function to find matched meals
async function findMatchedMeal(choices, curUser) {
    let matchedMeals = [];
    let healthMatch = false, mealMatch = false, genreMatch = false, ingMatch = true;
    
    const meals = await Meal.find({ owner: curUser });
    const pantryItems = await Pantry.find({ inStock: true, owner: curUser });
    
    for (let meal of meals) {
        const sortedTags = sortTags(meal.tags);
        
        for (let ch of choices) {
            ch = ch.toLowerCase();
            if (sortedTags.healthTags.includes(ch)) healthMatch = true;
            if (sortedTags.mealTags.includes(ch)) mealMatch = true;
            if (sortedTags.genreTags.includes(ch)) genreMatch = true;
        }
        
        let ingredients = [];
        for (let item of pantryItems) ingredients.push(item.name.toLowerCase());
        
        for (let ingredient of meal.ingredients) {
            if (!ingredients.includes(ingredient.toLowerCase())) ingMatch = false;
            if (ingredients.includes(ingredient.toLowerCase() + 's')) ingMatch = true;
            if (ingredients.includes(ingredient.toLowerCase().slice(0, -1))) ingMatch = true;
        }
        
        if (healthMatch && mealMatch && genreMatch && ingMatch) {
            matchedMeals.push(meal);
        }
        
        healthMatch = false; mealMatch = false; genreMatch = false; ingMatch = true;
    }
    
    return matchedMeals;
}

function sortTags(tags) {
    let sortedTags = { healthTags: [], mealTags: [], genreTags: [] };
    
    for (let tag of tags) {
        tag = tag.toLowerCase();
        if (tag === "healthy" || tag === "regular") sortedTags.healthTags.push(tag);
        else if (tag === "breakfast" || tag === "lunch" || tag === "dinner") sortedTags.mealTags.push(tag);
        else if (tag === "dairy" || tag === "parve" || tag === "meaty") sortedTags.genreTags.push(tag);
    }
    
    return sortedTags;
}

// ==============================================
// PANTRY API ROUTES
// ==============================================

router.get('/pantry', isLoggedIn, async (req, res) => {
    try {
        const curUsername = res.locals.currentUser.username;
        const items = await Pantry.find({ owner: curUsername });
        
        // Group items by category
        const categories = {};
        const savedItems = [];
        
        items.forEach(item => {
            if (item.inStock) {
                if (!categories[item.category]) {
                    categories[item.category] = [];
                }
                categories[item.category].push(item);
            } else {
                savedItems.push(item);
            }
        });
        
        res.json({ categories, savedItems });
    } catch (error) {
        console.error('Error fetching pantry:', error);
        res.status(500).json({ error: 'Failed to fetch pantry' });
    }
});

router.post('/pantry/add-item/:category', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.body;
        const { category } = req.params;
        const curUsername = res.locals.currentUser.username;
        
        await Pantry.insertMany({ name, category, owner: curUsername, inStock: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding pantry item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

router.put('/pantry/move-to-saved/:name', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.params;
        const curUsername = res.locals.currentUser.username;
        
        await Pantry.updateMany({ name, owner: curUsername }, { inStock: false });
        res.json({ success: true });
    } catch (error) {
        console.error('Error moving to saved:', error);
        res.status(500).json({ error: 'Failed to move item' });
    }
});

router.put('/pantry/move-from-saved/:name', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.params;
        const curUsername = res.locals.currentUser.username;
        
        await Pantry.updateMany({ name, owner: curUsername }, { inStock: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Error moving from saved:', error);
        res.status(500).json({ error: 'Failed to move item' });
    }
});

router.put('/pantry/move-to-cart/:name', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.params;
        const curUsername = res.locals.currentUser.username;
        
        // Move to shopping list
        const pantryItem = await Pantry.findOne({ name, owner: curUsername });
        if (pantryItem) {
            await ShoppingList.insertMany({ 
                name: pantryItem.name, 
                category: pantryItem.category, 
                owner: curUsername 
            });
            await Pantry.deleteMany({ name, owner: curUsername });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error moving to cart:', error);
        res.status(500).json({ error: 'Failed to move to cart' });
    }
});

router.patch('/pantry/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        await Pantry.findByIdAndUpdate(id, { name });
        res.json({ success: true });
    } catch (error) {
        console.error('Error editing pantry item:', error);
        res.status(500).json({ error: 'Failed to edit item' });
    }
});

router.delete('/pantry/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        
        await Pantry.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting pantry item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// ==============================================
// SHOPPING LIST API ROUTES
// ==============================================

router.get('/shopping-list', isLoggedIn, async (req, res) => {
    try {
        const curUsername = res.locals.currentUser.username;
        const items = await ShoppingList.find({ owner: curUsername });
        
        // Group items by category
        const categories = {};
        
        items.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });
        
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching shopping list:', error);
        res.status(500).json({ error: 'Failed to fetch shopping list' });
    }
});

router.post('/shopping-list/add-item/:category', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.body;
        const { category } = req.params;
        const curUsername = res.locals.currentUser.username;
        
        await ShoppingList.insertMany({ name, category, owner: curUsername });
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding shopping list item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

router.put('/shopping-list/move-to-pantry/:name', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.params;
        const curUsername = res.locals.currentUser.username;
        
        // Move to pantry
        const listItem = await ShoppingList.findOne({ name, owner: curUsername });
        if (listItem) {
            await Pantry.insertMany({ 
                name: listItem.name, 
                category: listItem.category, 
                owner: curUsername,
                inStock: true
            });
            await ShoppingList.deleteMany({ name, owner: curUsername });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error moving to pantry:', error);
        res.status(500).json({ error: 'Failed to move to pantry' });
    }
});

router.patch('/shopping-list/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        await ShoppingList.findByIdAndUpdate(id, { name });
        res.json({ success: true });
    } catch (error) {
        console.error('Error editing shopping list item:', error);
        res.status(500).json({ error: 'Failed to edit item' });
    }
});

router.delete('/shopping-list/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        
        await ShoppingList.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting shopping list item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;


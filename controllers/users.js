import User from "../models/user.js";
import Pantry from "../models/pantry.js";
import ShoppingList from "../models/shopping-list.js";
import Meals from "../models/meal.js";

export const renderRegisterForm = (req, res) => {
    res.render('users/register');
}

export const registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Meal Creator!');
            res.redirect('/app');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

export const renderLoginForm =  (req, res) => {
    res.render('users/login');
}

export const login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || "/app";
    // console.log(redirectUrl)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

export const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/login');
      });
}

export const demoLogin = async (req, res, next) => {
    try {
        const demoUsername = 'demo';
        let demoUser = await User.findOne({ username: demoUsername });
        
        // If demo user doesn't exist, create it with all demo data
        if (!demoUser) {
            console.log('Creating demo user and populating data...');
            
            // Create demo user
            demoUser = new User({ email: 'demo@mealcreator.com', username: demoUsername });
            await User.register(demoUser, 'demo123');
            
            // Populate demo data
            await seedDemoData(demoUsername);
            console.log('Demo user and data created successfully');
        }
        
        // Check if demo data exists, if not, populate it
        const pantryCount = await Pantry.countDocuments({ owner: demoUsername });
        if (pantryCount === 0) {
            console.log('Demo data missing, repopulating...');
            await seedDemoData(demoUsername);
        }
        
        // Log in the demo user
        req.login(demoUser, (err) => {
            if (err) {
                console.error('Demo login error:', err);
                req.flash('error', 'Error logging into demo account');
                return res.redirect('/login');
            }
            req.flash('success', 'Welcome to the Demo Account! Feel free to explore!');
            res.redirect('/app');
        });
    } catch (e) {
        console.error('Demo login error:', e);
        req.flash('error', 'Error logging into demo account. Please try again.');
        res.redirect('/login');
    }
}

// Helper function to seed demo data
async function seedDemoData(demoUsername) {
    // Pantry items - comprehensive list
    const pantryItems = [
        // Vegetables
        { name: "Tomatoes", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Onions", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Garlic", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Spinach", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Bell Peppers", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Broccoli", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Mushrooms", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Zucchini", category: "Vegetables", owner: demoUsername, inStock: true },
        { name: "Potatoes", category: "Vegetables", owner: demoUsername, inStock: true },
        // Fruits
        { name: "Apples", category: "Fruits", owner: demoUsername, inStock: true },
        { name: "Bananas", category: "Fruits", owner: demoUsername, inStock: true },
        { name: "Lemons", category: "Fruits", owner: demoUsername, inStock: true },
        { name: "Avocado", category: "Fruits", owner: demoUsername, inStock: true },
        { name: "Strawberries", category: "Fruits", owner: demoUsername, inStock: true },
        // Grains & Pasta
        { name: "Pasta", category: "Grains Pasta", owner: demoUsername, inStock: true },
        { name: "Rice", category: "Grains Pasta", owner: demoUsername, inStock: true },
        { name: "Quinoa", category: "Grains Pasta", owner: demoUsername, inStock: true },
        { name: "Oats", category: "Grains Pasta", owner: demoUsername, inStock: true },
        { name: "Bread", category: "Grains Pasta", owner: demoUsername, inStock: true },
        // Dairy
        { name: "Milk", category: "Dairy", owner: demoUsername, inStock: true },
        { name: "Cheese", category: "Dairy", owner: demoUsername, inStock: true },
        { name: "Yogurt", category: "Dairy", owner: demoUsername, inStock: true },
        { name: "Butter", category: "Dairy", owner: demoUsername, inStock: true },
        { name: "Cream", category: "Dairy", owner: demoUsername, inStock: true },
        // Fish & Eggs
        { name: "Eggs", category: "Fish Eggs", owner: demoUsername, inStock: true },
        { name: "Salmon", category: "Fish Eggs", owner: demoUsername, inStock: true },
        { name: "Tuna", category: "Fish Eggs", owner: demoUsername, inStock: true },
        // Meat & Poultry
        { name: "Chicken", category: "Meat Poultry", owner: demoUsername, inStock: true },
        { name: "Ground Beef", category: "Meat Poultry", owner: demoUsername, inStock: true },
        { name: "Turkey", category: "Meat Poultry", owner: demoUsername, inStock: true },
        // Fats & Oils
        { name: "Olive Oil", category: "Fats Oils", owner: demoUsername, inStock: true },
        { name: "Coconut Oil", category: "Fats Oils", owner: demoUsername, inStock: true },
        { name: "Vegetable Oil", category: "Fats Oils", owner: demoUsername, inStock: true },
        // Condiments
        { name: "Salt", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Pepper", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Soy Sauce", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Ketchup", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Mustard", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Mayonnaise", category: "Condiments", owner: demoUsername, inStock: true },
        { name: "Hot Sauce", category: "Condiments", owner: demoUsername, inStock: true },
        // Baking
        { name: "Flour", category: "Baking", owner: demoUsername, inStock: true },
        { name: "Sugar", category: "Baking", owner: demoUsername, inStock: true },
        { name: "Baking Powder", category: "Baking", owner: demoUsername, inStock: true },
        { name: "Vanilla Extract", category: "Baking", owner: demoUsername, inStock: true },
        { name: "Honey", category: "Baking", owner: demoUsername, inStock: true },
        // Nuts & Snacks
        { name: "Almonds", category: "Nuts Snacks", owner: demoUsername, inStock: true },
        { name: "Peanut Butter", category: "Nuts Snacks", owner: demoUsername, inStock: true },
        { name: "Granola", category: "Nuts Snacks", owner: demoUsername, inStock: true }
    ];

    const shoppingListItems = [
        { name: "Lettuce", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Carrots", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Cucumbers", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Celery", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Oranges", category: "Fruits", owner: demoUsername, inStock: false },
        { name: "Grapes", category: "Fruits", owner: demoUsername, inStock: false },
        { name: "Blueberries", category: "Fruits", owner: demoUsername, inStock: false },
        { name: "Tortillas", category: "Grains Pasta", owner: demoUsername, inStock: false },
        { name: "Cereal", category: "Grains Pasta", owner: demoUsername, inStock: false },
        { name: "Sour Cream", category: "Dairy", owner: demoUsername, inStock: false },
        { name: "Mozzarella", category: "Dairy", owner: demoUsername, inStock: false },
        { name: "Bacon", category: "Meat Poultry", owner: demoUsername, inStock: false },
        { name: "Sausage", category: "Meat Poultry", owner: demoUsername, inStock: false },
        { name: "Ranch Dressing", category: "Condiments", owner: demoUsername, inStock: false },
        { name: "Coffee", category: "Miscellaneous", owner: demoUsername, inStock: false },
        { name: "Tea", category: "Miscellaneous", owner: demoUsername, inStock: false }
    ];

    const meals = [
        { mealName: "Healthy Breakfast Bowl", ingredients: ["Eggs", "Spinach", "Tomatoes", "Cheese"], tags: ["Healthy", "Breakfast", "Dairy"], imgSrc: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80", instructions: "Scramble eggs with fresh spinach, top with diced tomatoes and shredded cheese.", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 10, servings: 2 },
        { mealName: "Cheese Omelette", ingredients: ["Eggs", "Cheese", "Milk", "Butter"], tags: ["Healthy", "Breakfast", "Dairy"], imgSrc: "https://images.unsplash.com/photo-1612844438441-1e1f6b8b1b1e?w=600&q=80", instructions: "Whisk eggs with milk, pour into buttered pan, fold with cheese inside", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 8, servings: 1 },
        { mealName: "Yogurt Parfait", ingredients: ["Yogurt", "Granola", "Strawberries", "Honey"], tags: ["Healthy", "Breakfast", "Dairy"], imgSrc: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80", instructions: "Layer yogurt with granola and fresh strawberries, drizzle with honey", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 0, servings: 1 },
        { mealName: "Avocado Toast", ingredients: ["Bread", "Avocado", "Tomatoes", "Salt", "Pepper"], tags: ["Healthy", "Breakfast", "Parve"], imgSrc: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&q=80", instructions: "Toast bread, mash avocado on top, add sliced tomatoes, season with salt and pepper", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 3, servings: 1 },
        { mealName: "Banana Oatmeal", ingredients: ["Oats", "Bananas", "Honey", "Almonds"], tags: ["Healthy", "Breakfast", "Parve"], imgSrc: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80", instructions: "Cook oats, top with sliced bananas, drizzle honey, sprinkle almonds", owner: demoUsername, confirmed: true, prepTime: 2, cookTime: 5, servings: 1 },
        { mealName: "Greek Salad", ingredients: ["Tomatoes", "Cheese", "Olive Oil", "Lemons"], tags: ["Healthy", "Lunch", "Dairy"], imgSrc: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80", instructions: "Chop tomatoes and cheese, dress with olive oil and lemon juice", owner: demoUsername, confirmed: true, prepTime: 10, cookTime: 0, servings: 2 },
        { mealName: "Quinoa Veggie Bowl", ingredients: ["Quinoa", "Broccoli", "Bell Peppers", "Olive Oil", "Garlic"], tags: ["Healthy", "Lunch", "Parve"], imgSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", instructions: "Cook quinoa, sauté vegetables with garlic in olive oil, combine", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 20, servings: 3 },
        { mealName: "Simple Rice Bowl", ingredients: ["Rice", "Eggs", "Spinach", "Soy Sauce"], tags: ["Healthy", "Lunch", "Parve"], imgSrc: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80", instructions: "Cook rice, top with fried eggs and sautéed spinach, drizzle with soy sauce", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 15, servings: 2 },
        { mealName: "Chicken Pasta", ingredients: ["Chicken", "Pasta", "Tomatoes", "Garlic", "Olive Oil"], tags: ["Regular", "Dinner", "Meaty"], imgSrc: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", instructions: "Cook pasta, sauté chicken with garlic and tomatoes in olive oil, combine", owner: demoUsername, confirmed: true, prepTime: 10, cookTime: 25, servings: 4 },
        { mealName: "Garlic Chicken", ingredients: ["Chicken", "Garlic", "Olive Oil", "Salt", "Pepper"], tags: ["Regular", "Dinner", "Meaty"], imgSrc: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80", instructions: "Marinate chicken with minced garlic, salt, pepper. Pan fry in olive oil until golden", owner: demoUsername, confirmed: true, prepTime: 10, cookTime: 20, servings: 3 },
        { mealName: "Beef Stir Fry", ingredients: ["Ground Beef", "Vegetables", "Soy Sauce", "Rice"], tags: ["Regular", "Dinner", "Meaty"], imgSrc: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80", instructions: "Brown ground beef, add vegetables, season with soy sauce, serve over rice", owner: demoUsername, confirmed: true, prepTime: 8, cookTime: 15, servings: 4 },
        { mealName: "Grilled Salmon", ingredients: ["Salmon", "Lemons", "Olive Oil", "Garlic"], tags: ["Healthy", "Dinner", "Parve"], imgSrc: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80", instructions: "Marinate salmon with lemon juice, garlic, and olive oil. Grill until cooked through", owner: demoUsername, confirmed: true, prepTime: 10, cookTime: 15, servings: 2 },
        { mealName: "Veggie Stir Fry", ingredients: ["Broccoli", "Bell Peppers", "Mushrooms", "Soy Sauce", "Rice"], tags: ["Healthy", "Dinner", "Parve"], imgSrc: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", instructions: "Stir fry vegetables with soy sauce, serve over steamed rice", owner: demoUsername, confirmed: true, prepTime: 10, cookTime: 15, servings: 3 },
        { mealName: "Turkey Sandwich", ingredients: ["Turkey", "Bread", "Tomatoes", "Mayonnaise"], tags: ["Regular", "Lunch", "Meaty"], imgSrc: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80", instructions: "Layer turkey, tomatoes, and mayo between toasted bread slices", owner: demoUsername, confirmed: true, prepTime: 5, cookTime: 2, servings: 1 },
        { mealName: "Breakfast Burrito", ingredients: ["Eggs", "Chicken", "Cheese", "Tomatoes"], tags: ["Regular", "Breakfast", "Meaty"], imgSrc: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80", instructions: "Scramble eggs with cooked chicken, add cheese and tomatoes", owner: demoUsername, confirmed: true, prepTime: 8, cookTime: 10, servings: 2 }
    ];

    const shoppingListItems = [
        { name: "Lettuce", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Carrots", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Cucumbers", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Celery", category: "Vegetables", owner: demoUsername, inStock: false },
        { name: "Oranges", category: "Fruits", owner: demoUsername, inStock: false },
        { name: "Grapes", category: "Fruits", owner: demoUsername, inStock: false },
        { name: "Blueberries", category: "Fruits", owner: demoUsername, inStock: false },
        { name: "Tortillas", category: "Grains Pasta", owner: demoUsername, inStock: false },
        { name: "Cereal", category: "Grains Pasta", owner: demoUsername, inStock: false },
        { name: "Sour Cream", category: "Dairy", owner: demoUsername, inStock: false },
        { name: "Mozzarella", category: "Dairy", owner: demoUsername, inStock: false },
        { name: "Bacon", category: "Meat Poultry", owner: demoUsername, inStock: false },
        { name: "Sausage", category: "Meat Poultry", owner: demoUsername, inStock: false },
        { name: "Ranch Dressing", category: "Condiments", owner: demoUsername, inStock: false },
        { name: "Coffee", category: "Miscellaneous", owner: demoUsername, inStock: false },
        { name: "Tea", category: "Miscellaneous", owner: demoUsername, inStock: false }
    ];

    // Clear existing demo data
    await Pantry.deleteMany({ owner: demoUsername });
    await ShoppingList.deleteMany({ owner: demoUsername });
    await Meals.deleteMany({ owner: demoUsername });

    // Insert new data
    await Pantry.insertMany(pantryItems);
    await ShoppingList.insertMany(shoppingListItems);
    await Meals.insertMany(meals);
    
    console.log(`Seeded ${pantryItems.length} pantry items, ${shoppingListItems.length} shopping items, ${meals.length} meals`);
}
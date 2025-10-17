// -------------------------------------------------------- DEMO DATA SEEDER -------------------------------------------------------
import {} from 'dotenv/config'
import pkg from 'mongoose';
const { connect } = pkg;
import User from './models/user.js';
import Pantry from './models/pantry.js';
import ShoppingList from './models/shopping-list.js';
import Meals from './models/meal.js';

const dbUrl = process.env.DB_URL || "mongodb+srv://natanelrichey_db_user:X4EXwqcwo7ldxtUZ@cluster0.afremsw.mongodb.net/mealcreator?retryWrites=true&w=majority&appName=Cluster0";

connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("DATABASE CONNECTED")
})
.catch(err => {
    console.log("DATABASE CONNECTION ERROR")
    console.log(err)
})

// -------------------------------------------------------- DEMO DATA -------------------------------------------------------

const demoUsername = "demo";
const demoEmail = "demo@mealcreator.com";
const demoPassword = "demo123";

// Sample Pantry Items - Expanded
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

// Sample Shopping List Items - Expanded
const shoppingListItems = [
    // Vegetables
    { name: "Lettuce", category: "Vegetables", owner: demoUsername, inStock: false },
    { name: "Carrots", category: "Vegetables", owner: demoUsername, inStock: false },
    { name: "Cucumbers", category: "Vegetables", owner: demoUsername, inStock: false },
    { name: "Celery", category: "Vegetables", owner: demoUsername, inStock: false },
    
    // Fruits
    { name: "Oranges", category: "Fruits", owner: demoUsername, inStock: false },
    { name: "Grapes", category: "Fruits", owner: demoUsername, inStock: false },
    { name: "Blueberries", category: "Fruits", owner: demoUsername, inStock: false },
    
    // Grains & Pasta
    { name: "Tortillas", category: "Grains Pasta", owner: demoUsername, inStock: false },
    { name: "Cereal", category: "Grains Pasta", owner: demoUsername, inStock: false },
    
    // Dairy
    { name: "Sour Cream", category: "Dairy", owner: demoUsername, inStock: false },
    { name: "Mozzarella", category: "Dairy", owner: demoUsername, inStock: false },
    
    // Meat & Poultry
    { name: "Bacon", category: "Meat Poultry", owner: demoUsername, inStock: false },
    { name: "Sausage", category: "Meat Poultry", owner: demoUsername, inStock: false },
    
    // Condiments
    { name: "Ranch Dressing", category: "Condiments", owner: demoUsername, inStock: false },
    
    // Miscellaneous
    { name: "Coffee", category: "Miscellaneous", owner: demoUsername, inStock: false },
    { name: "Tea", category: "Miscellaneous", owner: demoUsername, inStock: false }
];

// Sample Meals - Expanded with Real Images
const meals = [
    // BREAKFAST - DAIRY - HEALTHY
    {
        mealName: "Healthy Breakfast Bowl",
        ingredients: ["Eggs", "Spinach", "Tomatoes", "Cheese"],
        tags: ["Healthy", "Breakfast", "Dairy"],
        imgSrc: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80",
        instructions: "Scramble eggs with fresh spinach, top with diced tomatoes and shredded cheese. Season with salt and pepper.",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 10,
        servings: 2
    },
    {
        mealName: "Cheese Omelette",
        ingredients: ["Eggs", "Cheese", "Milk", "Butter"],
        tags: ["Healthy", "Breakfast", "Dairy"],
        imgSrc: "https://images.unsplash.com/photo-1612844438441-1e1f6b8b1b1e?w=600&q=80",
        instructions: "Whisk eggs with milk, pour into buttered pan, fold with cheese inside",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 8,
        servings: 1
    },
    {
        mealName: "Yogurt Parfait",
        ingredients: ["Yogurt", "Granola", "Strawberries", "Honey"],
        tags: ["Healthy", "Breakfast", "Dairy"],
        imgSrc: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
        instructions: "Layer yogurt with granola and fresh strawberries, drizzle with honey",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 0,
        servings: 1
    },
    
    // BREAKFAST - PARVE - HEALTHY
    {
        mealName: "Avocado Toast",
        ingredients: ["Bread", "Avocado", "Tomatoes", "Salt", "Pepper"],
        tags: ["Healthy", "Breakfast", "Parve"],
        imgSrc: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&q=80",
        instructions: "Toast bread, mash avocado on top, add sliced tomatoes, season with salt and pepper",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 3,
        servings: 1
    },
    {
        mealName: "Banana Oatmeal",
        ingredients: ["Oats", "Bananas", "Honey", "Almonds"],
        tags: ["Healthy", "Breakfast", "Parve"],
        imgSrc: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80",
        instructions: "Cook oats, top with sliced bananas, drizzle honey, sprinkle almonds",
        owner: demoUsername,
        confirmed: true,
        prepTime: 2,
        cookTime: 5,
        servings: 1
    },
    
    // LUNCH - DAIRY - HEALTHY
    {
        mealName: "Greek Salad",
        ingredients: ["Tomatoes", "Cheese", "Olive Oil", "Lemons"],
        tags: ["Healthy", "Lunch", "Dairy"],
        imgSrc: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
        instructions: "Chop tomatoes and cheese, dress with olive oil and lemon juice",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 0,
        servings: 2
    },
    
    // LUNCH - PARVE - HEALTHY
    {
        mealName: "Quinoa Veggie Bowl",
        ingredients: ["Quinoa", "Broccoli", "Bell Peppers", "Olive Oil", "Garlic"],
        tags: ["Healthy", "Lunch", "Parve"],
        imgSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        instructions: "Cook quinoa, sauté vegetables with garlic in olive oil, combine",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 20,
        servings: 3
    },
    {
        mealName: "Simple Rice Bowl",
        ingredients: ["Rice", "Eggs", "Spinach", "Soy Sauce"],
        tags: ["Healthy", "Lunch", "Parve"],
        imgSrc: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
        instructions: "Cook rice, top with fried eggs and sautéed spinach, drizzle with soy sauce",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 15,
        servings: 2
    },
    
    // DINNER - MEATY - REGULAR
    {
        mealName: "Chicken Pasta",
        ingredients: ["Chicken", "Pasta", "Tomatoes", "Garlic", "Olive Oil"],
        tags: ["Regular", "Dinner", "Meaty"],
        imgSrc: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
        instructions: "Cook pasta, sauté chicken with garlic and tomatoes in olive oil, combine",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 25,
        servings: 4
    },
    {
        mealName: "Garlic Chicken",
        ingredients: ["Chicken", "Garlic", "Olive Oil", "Salt", "Pepper"],
        tags: ["Regular", "Dinner", "Meaty"],
        imgSrc: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80",
        instructions: "Marinate chicken with minced garlic, salt, pepper. Pan fry in olive oil until golden",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 20,
        servings: 3
    },
    {
        mealName: "Beef Stir Fry",
        ingredients: ["Ground Beef", "Vegetables", "Soy Sauce", "Rice"],
        tags: ["Regular", "Dinner", "Meaty"],
        imgSrc: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80",
        instructions: "Brown ground beef, add vegetables, season with soy sauce, serve over rice",
        owner: demoUsername,
        confirmed: true,
        prepTime: 8,
        cookTime: 15,
        servings: 4
    },
    
    // DINNER - PARVE - HEALTHY
    {
        mealName: "Grilled Salmon",
        ingredients: ["Salmon", "Lemons", "Olive Oil", "Garlic"],
        tags: ["Healthy", "Dinner", "Parve"],
        imgSrc: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
        instructions: "Marinate salmon with lemon juice, garlic, and olive oil. Grill until cooked through",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 15,
        servings: 2
    },
    {
        mealName: "Veggie Stir Fry",
        ingredients: ["Broccoli", "Bell Peppers", "Mushrooms", "Soy Sauce", "Rice"],
        tags: ["Healthy", "Dinner", "Parve"],
        imgSrc: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
        instructions: "Stir fry vegetables with soy sauce, serve over steamed rice",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 15,
        servings: 3
    },
    
    // LUNCH - MEATY - REGULAR
    {
        mealName: "Turkey Sandwich",
        ingredients: ["Turkey", "Bread", "Tomatoes", "Mayonnaise"],
        tags: ["Regular", "Lunch", "Meaty"],
        imgSrc: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80",
        instructions: "Layer turkey, tomatoes, and mayo between toasted bread slices",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 2,
        servings: 1
    },
    
    // BREAKFAST - MEATY - REGULAR
    {
        mealName: "Breakfast Burrito",
        ingredients: ["Eggs", "Chicken", "Cheese", "Tomatoes"],
        tags: ["Regular", "Breakfast", "Meaty"],
        imgSrc: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80",
        instructions: "Scramble eggs with cooked chicken, add cheese and tomatoes, wrap in tortilla",
        owner: demoUsername,
        confirmed: true,
        prepTime: 8,
        cookTime: 10,
        servings: 2
    }
];

// -------------------------------------------------------- SEED FUNCTION -------------------------------------------------------

const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...");
        
        // 1. Check if demo user exists, if not create it
        let demoUser = await User.findOne({ username: demoUsername });
        
        if (!demoUser) {
            console.log("Creating demo user...");
            demoUser = new User({ email: demoEmail, username: demoUsername });
            await User.register(demoUser, demoPassword);
            console.log("✅ Demo user created successfully!");
        } else {
            console.log("ℹ️ Demo user already exists");
        }
        
        // 2. Clear existing demo data
        console.log("Clearing existing demo data...");
        await Pantry.deleteMany({ owner: demoUsername });
        await ShoppingList.deleteMany({ owner: demoUsername });
        await Meals.deleteMany({ owner: demoUsername });
        console.log("✅ Cleared old demo data");
        
        // 3. Insert Pantry Items
        console.log("Inserting pantry items...");
        await Pantry.insertMany(pantryItems);
        console.log(`✅ Added ${pantryItems.length} pantry items`);
        
        // 4. Insert Shopping List Items
        console.log("Inserting shopping list items...");
        await ShoppingList.insertMany(shoppingListItems);
        console.log(`✅ Added ${shoppingListItems.length} shopping list items`);
        
        // 5. Insert Meals
        console.log("Inserting meals...");
        await Meals.insertMany(meals);
        console.log(`✅ Added ${meals.length} meals`);
        
        console.log("\n🎉 Database seeding completed successfully!");
        console.log("\n📋 Demo Account Credentials:");
        console.log("   Username: demo");
        console.log("   Password: demo123");
        console.log("   Email: demo@mealcreator.com");
        console.log("\n✨ You can now use the 'Try Me' feature with this account!\n");
        
        process.exit(0);
        
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

// Run the seeder
seedDatabase();


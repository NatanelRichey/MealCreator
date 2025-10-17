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

// Sample Pantry Items
const pantryItems = [
    { name: "Tomatoes", category: "Vegetables", owner: demoUsername, inStock: true },
    { name: "Onions", category: "Vegetables", owner: demoUsername, inStock: true },
    { name: "Garlic", category: "Vegetables", owner: demoUsername, inStock: true },
    { name: "Spinach", category: "Vegetables", owner: demoUsername, inStock: true },
    { name: "Apples", category: "Fruits", owner: demoUsername, inStock: true },
    { name: "Bananas", category: "Fruits", owner: demoUsername, inStock: true },
    { name: "Pasta", category: "Grains Pasta", owner: demoUsername, inStock: true },
    { name: "Rice", category: "Grains Pasta", owner: demoUsername, inStock: true },
    { name: "Milk", category: "Dairy", owner: demoUsername, inStock: true },
    { name: "Cheese", category: "Dairy", owner: demoUsername, inStock: true },
    { name: "Eggs", category: "Fish Eggs", owner: demoUsername, inStock: true },
    { name: "Chicken", category: "Meat Poultry", owner: demoUsername, inStock: true },
    { name: "Olive Oil", category: "Fats Oils", owner: demoUsername, inStock: true },
    { name: "Salt", category: "Condiments", owner: demoUsername, inStock: true },
    { name: "Pepper", category: "Condiments", owner: demoUsername, inStock: true },
    { name: "Flour", category: "Baking", owner: demoUsername, inStock: true },
    { name: "Sugar", category: "Baking", owner: demoUsername, inStock: true }
];

// Sample Shopping List Items
const shoppingListItems = [
    { name: "Lettuce", category: "Vegetables", owner: demoUsername, inStock: false },
    { name: "Carrots", category: "Vegetables", owner: demoUsername, inStock: false },
    { name: "Bread", category: "Grains Pasta", owner: demoUsername, inStock: false },
    { name: "Butter", category: "Dairy", owner: demoUsername, inStock: false },
    { name: "Coffee", category: "Miscellaneous", owner: demoUsername, inStock: false }
];

// Sample Meals
const meals = [
    {
        mealName: "Healthy Breakfast Bowl",
        ingredients: ["Eggs", "Spinach", "Tomatoes", "Cheese"],
        tags: ["Healthy", "Breakfast", "Dairy"],
        imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg",
        instructions: "Scramble eggs with spinach, top with tomatoes and cheese",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 10,
        servings: 2
    },
    {
        mealName: "Chicken Pasta",
        ingredients: ["Chicken", "Pasta", "Tomatoes", "Garlic", "Olive Oil"],
        tags: ["Regular", "Dinner", "Meaty"],
        imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg",
        instructions: "Cook pasta, sauté chicken with garlic and tomatoes",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 20,
        servings: 4
    },
    {
        mealName: "Simple Rice Bowl",
        ingredients: ["Rice", "Eggs", "Vegetables"],
        tags: ["Healthy", "Lunch", "Parve"],
        imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg",
        instructions: "Cook rice, top with fried eggs and sautéed vegetables",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 15,
        servings: 2
    },
    {
        mealName: "Cheese Omelette",
        ingredients: ["Eggs", "Cheese", "Milk"],
        tags: ["Healthy", "Breakfast", "Dairy"],
        imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg",
        instructions: "Whisk eggs with milk, cook and add cheese",
        owner: demoUsername,
        confirmed: true,
        prepTime: 5,
        cookTime: 10,
        servings: 1
    },
    {
        mealName: "Garlic Chicken",
        ingredients: ["Chicken", "Garlic", "Olive Oil", "Salt", "Pepper"],
        tags: ["Regular", "Dinner", "Meaty"],
        imgSrc: "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg",
        instructions: "Marinate chicken with garlic, salt, pepper. Pan fry in olive oil",
        owner: demoUsername,
        confirmed: true,
        prepTime: 10,
        cookTime: 20,
        servings: 3
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


// -------------------------------------------------------- IMPORTS AND DECLARATIONS -------------------------------------------------------

import {} from 'dotenv/config'

// if (process.env.NODE_ENV !== "production") {
//     import {} from 'dotenv/config'
// }

import express, { urlencoded } from "express"
const app = express()

import pkg  from 'mongoose';
const { connect } = pkg

import methodOverride from "method-override"
app.use(methodOverride('_method'))

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path, { join } from "path"
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', join(__dirname, 'views'));

import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// --------------------------------------------------------- EXPRESS INITIALIZATIONS --------------------------------------------------------

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/FoodApp'
connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch(err => {
        console.log("CONNECTION ERROR")
        console.log(err)
    })

// ------------------------------------------------------------ SESSIONS & FLASH ------------------------------------------------------------

import session from 'express-session'
import { default as connectMongoDBSession} from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore ({
    uri: dbUrl,
    collection: 'sessions'
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR")
})

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

import flash from "connect-flash"
app.use(flash());

import passport from 'passport'
import LocalStrategy from 'passport-local'

import User from './models/user.js'

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let curUser = ""

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    curUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.curUrl = req.url;
    next();
})

// -------------------------------------------------------------- ROUTES --------------------------------------------------------------------

import pantryRoutes from "./routes/pantry.js";
import listRoutes from "./routes/list.js";
import mealsRoutes from "./routes/meals.js";
import appRoutes from "./routes/app.js";
import usersRoutes from "./routes/users.js";

app.use('/app', appRoutes)
app.use('/pantry', pantryRoutes)
app.use('/shopping-list', listRoutes)
app.use('/meals', mealsRoutes)
app.use('/', usersRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}!`)
})

export default curUser

// -------------------- -------------------------------------- GLOBAL VARIABLES -------------------------------------------------------------

// const categories = ["Vegetables", "Fruits", "Grains & Pasta", "Dairy", "Fish & Eggs", "Fats & Oils", "Condiments", "Freezer", "Miscellaneous", "Saved Items"]
// const shoppingCategories = ["Vegetables", "Fruits", "Grains & Pasta", "Dairy", "Fish & Eggs", "Fats & Oils", "Condiments", "Freezer", "Miscellaneous"]
// const choiceArr = [["Healthy","Regular"],["Breakfast","Lunch","Dinner"],["Dairy","Parve","Meaty"]]
// let toggleChoiceArr = {"Healthy":false,"Regular":false,"Breakfast":false,"Lunch":false,"Dinner":false,"Dairy":false,"Parve":false,"Meaty":false}
// let ingredients = []
// let tags = []
// let choices = []
// let matchedMeals = [

// -------------------------------------------------------- HTTP GET HERE - DONE!! ----------------------------------------------------------

// app.get('/', async (req, res) => {
//     res.render('app/first-page', { choiceArr })
//     choices = []
//     matchedMeals = []
// })

// app.get('/pantry', async (req, res) => {
//     const items = await Pantry.find({})
//     res.render('pantry', { items, categories })
// })

// app.get('/shopping-list', async (req, res) => {
//     const items = await ShoppingList.find({})
//     res.render('list', { items, shoppingCategories })
// })

// app.get('/meals', async (req, res) => {
//     const meals = await Meals.find({})
//     res.render('meal/meals', { meals })
// })

// app.get('/meals/new', async (req, res) => {
//     let item = new Meals ({mealName:"", ingredients:[], tags:[], imgSrc:""}); 
//     res.render('meal/meal-new', {item, choiceArr})
// })

// // -------------------------------------------------------- HTTP PUSH HERE --------------------------------------------------------------

// app.post('/app/:choice', async (req, res) => {
//     const choice = req.params.choice
//     if (!choices.includes(choice.toLowerCase())) choices.push(choice.toLowerCase())
//     if (choiceArr[0].includes(choice)){
//         res.render('app/second-page', { choiceArr })
//         }
//     else if (choiceArr[1].includes(choice)) {
//         res.render('app/third-page', { choiceArr })}
//     else {
//         await findMatchedMeal(choices)
//         res.render('app/filtered-page', { matchedMeals })
//     }
// })

// app.post('/pantry/:category', async (req, res) => {
//     const name = req.body.name
//     const category = req.params.category
//     await Pantry.insertMany({name:name, category:category});
//     res.redirect('/pantry')
// })

// app.post('/pantry/move/:name', async (req, res) => {
//     const name = req.params.name
//     await Pantry.updateMany({name:name},{inStock:false})
//     res.redirect('/pantry')
// })
 
// app.post('/pantry/move-back/:name', async (req, res) => {
//     const name = req.params.name
//     await Pantry.updateMany({name:name},{inStock:true})
//     res.redirect('/pantry')
// })

// app.post('/pantry/move-to-cart/:name', async (req, res) => {
//     const name = req.params.name
//     Pantry.findOne({name:name})
//     .then (res => {
//         ShoppingList.insertMany({name:res.name, category:res.category, inStock:true})
//     })
//     await Pantry.deleteMany({name:name})
//     res.redirect('/pantry')
// })

// app.post('/shopping-list/move-to-pantry/:name', async (req, res) => {
//     const name = req.params.name
//     ShoppingList.findOne({name:name})
//     .then (res => {
//         Pantry.insertMany({name:res.name, category:res.category, inStock:true})
//     })
//     await ShoppingList.deleteMany({name:name})
//     res.redirect('/shopping-list')
// })

// app.post('/shopping-list/:category', async (req, res) => {
//     const name = req.body.name
//     const category = req.params.category
//     ShoppingList.insertMany({name:name, category:category});
//     res.redirect('/shopping-list')
// })

// app.post('/meals/new/ingredients', async (req, res) => {
//     ingredients.push(req.body.ingredients)
//     console.log("[add ingredient pressed] ingredients:", ingredients)
// })

// app.delete('/meals/new/ingredients/:ingredient', async (req, res) => {
//     const ingredient = req.params.ingredient;
//     ingredients = arrayRemove(ingredients, ingredient)
// })

// app.post("/meals/new/tags/:choice", async (req, res) => {
//     const choice = req.params.choice
//     toggleChoiceArr[choice] = !toggleChoiceArr[choice]
//     if (toggleChoiceArr[choice]) tags.push(choice)
//     else {tags = arrayRemove(tags, choice)}
// })

// app.post('/meals/new/name-img', async (req, res) => { 
//     req.body.ingredients = ingredients
//     req.body.tags = tags
//     req.body.imgSrc = `/meal-images/${req.body.imgSrc}`
//     console.log(req.body.imgSrc)
//     const meal = new Meals(req.body);
//     Meals.insertMany(meal);
//     res.redirect('/meals')
//     tags = []
//     ingredients = []
// })

// // -------------------------------------------------------- HTTP UPDATE HERE --------------------------------------------------------------

// app.patch('/pantry/:id', async (req, res) => {
//     const { id } = req.params;
//     await Pantry.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
//     res.redirect('/pantry')
// })

// app.patch('/shopping-list/:id', async (req, res) => {
//     const { id } = req.params;
//     await ShoppingList.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
//     res.redirect('/shopping-list')
// })

// app.patch('/meals/:id', async (req, res) => {
//     const { id } = req.params;
//     await Meals.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
//     res.redirect('/meals')
// })

// app.post('/meals/edit/ingredients', async (req, res) => {
//     ingredients.push(req.body.ingredients)
// })

// app.delete('/meals/edit/ingredients/:ingredient', async (req, res) => {
//     const ingredient = req.params.ingredient;
//     ingredients = arrayRemove(ingredients, ingredient)
// })

// app.post("/meals/edit/tags/:choice", async (req, res) => {
//     const choice = req.params.choice
//     toggleChoiceArr[choice] = !toggleChoiceArr[choice]
//     if (toggleChoiceArr[choice]) tags.push(choice)
//     else {tags = arrayRemove(tags, choice)}
// })

// app.post('/meals/edit/all/:name', async (req, res) => {
//     const name = req.params.name;
//     const item = await Meals.findOne({mealName:name});
//     ingredients = item.ingredients
//     tags = item.tags
//     res.render('meal/meal-edit', { name, item, choiceArr })
// })

// app.patch('/meals/edit/name-img/:name', async (req, res) => {
//     req.body.ingredients = ingredients
//     req.body.tags = tags
//     req.body.imgSrc = `/meal-images/${req.body.imgSrc}`
//     await Meals.updateOne({mealName: req.params.name}, req.body, { runValidators: true, new: true });
//     res.redirect('/meals')
//     tags = []
//     ingredients = []
// })

// // ----------------------------------------------------- HTTP DELETE HERE - DONE!! ----------------------------------------------------------

// app.delete('/pantry/:id', async (req, res) => {
//     const { id } = req.params;
//     await Pantry.findByIdAndDelete(id);
//     res.redirect('/pantry')
// })

// app.delete('/shopping-list/:id', async (req, res) => {
//     const { id } = req.params;
//     await ShoppingList.findByIdAndDelete(id);
//     res.redirect('/shopping-list')
// })

// app.delete('/meals/:id', async (req, res) => {
//     const { id } = req.params;
//     await Meals.findByIdAndDelete(id);
//     res.redirect('/meals')
// })

// -------------------------------------------------------- GLOBAL FUNCTIONS --------------------------------------------------------------

// function arrayRemove (arr, value) { 
//     return arr.filter(function (ele) { return ele != value })
// }

// async function findMatchedMeal (res, req) {
//     let healthMatch = false, mealMatch = false, genreMatch = false, ingMatch = true
//     const meals = await Meals.find({})
//     const pantryItems = await Pantry.find({inStock:true})
//     for (let meal of meals) {
//         const sortedTags = sortTags(meal.tags)
//         for (let ch of choices) {
//             if (sortedTags["healthTags"].includes(ch)) healthMatch = true
//             if (sortedTags["mealTags"].includes(ch)) mealMatch = true
//             if (sortedTags["genreTags"].includes(ch)) genreMatch = true
//             }
//         let ingredients = []
//         for (let item of pantryItems) ingredients.push(item.name.toLowerCase())
//         for (let ingredient of meal.ingredients) {
//             if (!ingredients.includes(ingredient.toLowerCase())) ingMatch = false
//             if (ingredients.includes(ingredient.toLowerCase() + 's')) ingMatch = true
//             if (ingredients.includes(ingredient.toLowerCase().slice(0,-1))) ingMatch = true
//         }
//         if (healthMatch && mealMatch && genreMatch && ingMatch) {
//             matchedMeals.push(meal)
//         }
//         healthMatch = false; mealMatch = false; genreMatch = false; ingMatch = true; 
//         console.log(matchedMeals)
//     }
// }

// function sortTags(tags) {
//     let sortedTags = {"healthTags":[], "mealTags":[], "genreTags":[]}
//     for (let tag of tags) {
//         if (tag === "healthy" || tag === "regular") sortedTags["healthTags"].push(tag)
//         else if (tag === "breakfast" || tag === "lunch" || tag === "dinner") sortedTags["mealTags"].push(tag)
//         else if (tag === "dairy" || tag === "parve" || tag === "meaty") sortedTags["genreTags"].push(tag)
//     }
//     return sortedTags
// }
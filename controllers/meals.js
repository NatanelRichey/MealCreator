import Meals from "../models/meal.js"
import {v2 as cloudinary} from 'cloudinary'

const choiceArr = [["Healthy","Regular"],["Breakfast","Lunch","Dinner"],["Dairy","Parve","Meaty"]]
let toggleChoiceArr = {"Healthy":false,"Regular":false,"Breakfast":false,"Lunch":false,"Dinner":false,"Dairy":false,"Parve":false,"Meaty":false}
let ingredients = []
let tags = []

export const renderMeals =  async (req, res) => {
    const curUsername = res.locals.currentUser.username
    await Meals.deleteMany({confirmed: false, owner:curUsername})
    const meals = await Meals.find({owner:curUsername}).sort({mealName:1})
    res.render('meal/meals', { meals })
}

export const renderNewMealForm = async (req, res) => {
    const curUsername = res.locals.currentUser.username
    let item = new Meals ({mealName:"Untitled", ingredients:[], tags:[], imgSrc:"", owner:curUsername}); 
    const mealName = item.mealName
    toggleChoiceArr = {"Healthy":false,"Regular":false,"Breakfast":false,"Lunch":false,"Dinner":false,"Dairy":false,"Parve":false,"Meaty":false}
    Meals.insertMany(item);
    ingredients = []; tags = [];
    res.render('meal/meal-new', {item, choiceArr, mealName})
}

export const removeIngredientFromForm = async (req, res) => {
    const ingredient = req.params.ingredient;
    ingredients = arrayRemove(ingredients, ingredient)
}

export const toggleTags = async (req, res) => {
    const choice = req.params.choice
    // console.log("CHOICE...", choice)
    toggleChoiceArr[choice] = !toggleChoiceArr[choice]
    // console.log("TOGGLE CHOICE ARRAY...", toggleChoiceArr)
    if (toggleChoiceArr[choice]) tags.push(choice)
    else {tags = arrayRemove(tags, choice)}
    // console.log("TAGS LIST...", tags)
    updateFormAndReload(res, req.params.name, tags, "tags", req.params.status)
}

export const addMeal =  async (req, res) => {
    // try {
        req.body.imgSrc = req.file ? req.file.path : "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg"
        req.body.owner = res.locals.currentUser.username
        const meal = await Meals.findOneAndUpdate({mealName: req.params.name, owner: res.locals.currentUser.username}, req.body, {new: true});
        meal.confirmed = true; 
        await meal.save();
        // if (err) return next(err);
        req.flash('success', `${req.params.name} added succesfully to meals!`);
        res.redirect('/meals')
        tags = []
        ingredients = []
    // } catch (e) {
    //     req.flash('error', e.message);
    //     updateFormAndReload(res, req.body.mealName, ingredients, "none", "new")
    // }
}

export const editMealName = async (req, res) => {
    const { id } = req.params;
    const updatedMeal = await Meals.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    
    // Check if request is AJAX (from fetch)
    if (req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers['content-type'] === 'application/json') {
        return res.json({ success: true, meal: updatedMeal });
    }
    
    // Traditional form submission
    res.redirect('/meals')
}

export const addIngredientToForm = async (req, res) => {
    ingredients.push(req.body.ingredients)
    // console.log("NAME in addIng func...", req.params.name)
    updateFormAndReload(res, req.params.name, ingredients, "ingredients", req.params.status)
}

export const addNameToForm = async (req, res) => {
    updateFormAndReload(res, req.params.name, req.body.mealName, "name", req.params.status)
}

export const deleteIngredients =  async (req, res) => {
    const ingredient = req.params.ingredient;
    ingredients = arrayRemove(ingredients, ingredient)
    updateFormAndReload(res, req.params.name, ingredients, "ingredients", req.params.status)
}

export const renderEditMealForm = async (req, res) => {
    const mealName = req.params.name;
    const curUsername = res.locals.currentUser.username
    const item = await Meals.findOne({mealName, owner:curUsername});
    ingredients = item.ingredients
    tags = item.tags
    toggleChoiceArr = updateDictFromArray(item.tags, toggleChoiceArr)
    res.render('meal/meal-edit.ejs', { mealName, curUsername, item, choiceArr })
}

export const editMeal = async (req, res) => {
    // try {
    //     if (err) return next(err);
        const curUsername = res.locals.currentUser.username
        const oldMeal = await Meals.findOne({mealName: req.params.name, owner:curUsername});
        if (req.file) {
            req.body.imgSrc = req.file.path
            await Meals.findOneAndUpdate({mealName: req.params.name, owner:curUsername}, req.body, { runValidators: true});
            if (getPublicId(oldMeal.imgSrc) !== "meal-images/untitled-meal") {
                await cloudinary.uploader.destroy(getPublicId(oldMeal.imgSrc));
            }
        }
        else {
            req.body.imgSrc = oldMeal.imgSrc
            await Meals.findOneAndUpdate({mealName: req.params.name, owner:curUsername}, req.body, { runValidators: true});
        }
        req.flash('success', `${req.body.mealName} has changed!`);
        res.redirect('/meals')
        tags = []
        ingredients = []
    // } catch (e) {
    //     console.log("ERROR")
    //     req.flash('error', e.message);
    //     res.redirect(`/meals/edit/all/${req.params.name}`);
    // }
}

export const deleteMeal =  async (req, res) => {
    const { id } = req.params;
    const oldMeal = await Meals.findByIdAndDelete(id);
    if (getPublicId(oldMeal.imgSrc) !== "meal-images/untitled-meal") {
        await cloudinary.uploader.destroy(getPublicId(oldMeal.imgSrc));
    }
    req.flash('success', `Meal deleted`);
    res.redirect('/meals')
}

function arrayRemove (arr, value) { 
    return arr.filter(function (ele) { return ele != value })
}

function getPublicId(imgSrc) {
    // console.log("imgSrc", imgSrc)
    let truncImgSrc = imgSrc.split('/').splice(-2,2)
    // console.log("truncImgSrc", truncImgSrc)
    let end = truncImgSrc[1].split('.')
    // console.log("end", end)
    let publicId = truncImgSrc[0] + '/' + end[0]
    // console.log("pub:", publicId)
    return publicId
}

function updateDictFromArray (array, dict) {
    for (let elem of array) {
        dict[elem] = true
    }
    return dict
}

async function updateFormAndReload(res, name, updateValue, updateName, state) {
    const curUsername = res.locals.currentUser.username
    let item = await Meals.find({mealName:name, owner:curUsername})
    console.log(item)
    if (updateName === "ingredients") {
        item = await Meals.findOneAndUpdate({mealName:name, owner:curUsername}, {ingredients:updateValue}, {new: true}); }
    else if (updateName === "tags") {
        item = await Meals.findOneAndUpdate({mealName:name, owner:curUsername}, {tags:updateValue}, {new: true}); }
    else if (updateName === "name") {
        item = await Meals.findOneAndUpdate({mealName:name, owner:curUsername}, {mealName:updateValue}, {new: true}); }
    toggleChoiceArr = updateDictFromArray(item.tags, toggleChoiceArr)
    const mealName = item.mealName
    if (state === "edit") res.render('meal/meal-edit.ejs', { mealName, curUsername, item, choiceArr })
    if (state === "new") res.render('meal/meal-new.ejs', { mealName, curUsername, item, choiceArr })
} 
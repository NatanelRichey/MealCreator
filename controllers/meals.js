import Meals from "../models/meal.js"
import {v2 as cloudinary} from 'cloudinary'

const choiceArr = [["Healthy","Regular"],["Breakfast","Lunch","Dinner"],["Dairy","Parve","Meaty"]]
let toggleChoiceArr = {"Healthy":false,"Regular":false,"Breakfast":false,"Lunch":false,"Dinner":false,"Dairy":false,"Parve":false,"Meaty":false}
let ingredients = []
let tags = []

export const renderMeals =  async (req, res) => {
    const curUsername = res.locals.currentUser.username
    const meals = await Meals.find({owner:curUsername})
    res.render('meal/meals', { meals })
}

export const renderNewMealForm = async (req, res) => {
    const curUsername = res.locals.currentUser.username
    let item = new Meals ({mealName:"", ingredients:[], tags:[], imgSrc:"", owner:curUsername}); 
    res.render('meal/meal-new', {item, choiceArr})
}

export const addIngredientToForm = async (req, res) => {
    ingredients.push(req.body.ingredients)
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
}

export const addMeal =  async (req, res) => {
    // try {
    //     if (err) return next(err);
        // console.log("NO ERROR")
        req.body.ingredients = ingredients
        req.body.tags = tags
        req.body.imgSrc = req.file ? req.file.path : "https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg"
        req.body.owner = res.locals.currentUser.username
        const meal = new Meals(req.body);
        Meals.insertMany(meal);
        req.flash('success', `${req.body.mealName} added succesfully to meals!`);
        res.redirect('/meals')
        tags = []
        ingredients = []
    // } catch (e) {
    //     console.log("ERROR")
    //     req.flash('error', e.message);
    //     res.redirect('/meals/new');
    // }
}

export const editMealName = async (req, res) => {
    const { id } = req.params;
    await Meals.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect('/meals')
}

export const editIngredients = async (req, res) => {
    ingredients.push(req.body.ingredients)
    console.log("EDIT INGREDIENTS LIST...", ingredients)
}

export const deleteIngredients =  async (req, res) => {
    const ingredient = req.params.ingredient;
    ingredients = arrayRemove(ingredients, ingredient)
}

export const renderEditMealForm = async (req, res) => {
    const name = req.params.name;
    const curUsername = res.locals.currentUser.username
    const item = await Meals.findOne({mealName:name, owner:curUsername});
    ingredients = item.ingredients
    tags = item.tags
    toggleChoiceArr = updateDictFromArray(item.tags, toggleChoiceArr)
    res.render('meal/meal-edit.ejs', { name, curUsername, item, choiceArr })
}

export const editMeal = async (req, res) => {
    // try {
    //     if (err) return next(err);
        const curUsername = res.locals.currentUser.username
        const oldMeal = await Meals.findOne({mealName: req.params.name, owner:curUsername});
        req.body.ingredients = ingredients
        req.body.tags = tags
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
    console.log("imgSrc", imgSrc)
    let truncImgSrc = imgSrc.split('/').splice(-2,2)
    console.log("truncImgSrc", truncImgSrc)
    let end = truncImgSrc[1].split('.')
    console.log("end", end)
    let publicId = truncImgSrc[0] + '/' + end[0]
    console.log("pub:", publicId)
    return publicId
}

function updateDictFromArray (array, dict) {
    for (let elem of array) {
        dict[elem] = true
    }
    return dict
}
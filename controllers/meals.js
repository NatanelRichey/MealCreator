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

export const addTagToForm = async (req, res) => {
    const choice = req.params.choice
    toggleChoiceArr[choice] = !toggleChoiceArr[choice]
    if (toggleChoiceArr[choice]) tags.push(choice)
    else {tags = arrayRemove(tags, choice)}
}

export const addMeal =  async (req, res) => {
    req.body.ingredients = ingredients
    req.body.tags = tags
    req.body.imgSrc = req.file.path
    req.body.owner = res.locals.currentUser.username
    const meal = new Meals(req.body);
    Meals.insertMany(meal);
    req.flash('success', `${req.body.mealName} added succesfully to meals!`);
    res.redirect('/meals')
    tags = []
    ingredients = []
}

export const editMealName = async (req, res) => {
    const { id } = req.params;
    await Meals.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect('/meals')
}

export const editIngredients = async (req, res) => {
    ingredients.push(req.body.ingredients)
}

export const deleteIngredients =  async (req, res) => {
    const ingredient = req.params.ingredient;
    ingredients = arrayRemove(ingredients, ingredient)
}

export const editTags = async (req, res) => {
    const choice = req.params.choice
    toggleChoiceArr[choice] = !toggleChoiceArr[choice]
    if (toggleChoiceArr[choice]) tags.push(choice)
    else {tags = arrayRemove(tags, choice)}
}

export const renderEditMealForm = async (req, res) => {
    const name = req.params.name;
    const curUsername = res.locals.currentUser.username
    const item = await Meals.findOne({mealName:name, owner:curUsername});
    ingredients = item.ingredients
    tags = item.tags
    res.render('meal/meal-edit.ejs', { name, curUsername, item, choiceArr })
}

export const editMeal = async (req, res) => {
    const curUsername = res.locals.currentUser.username
    req.body.ingredients = ingredients
    req.body.tags = tags
    req.body.imgSrc = req.file.path
    const oldMeal = await Meals.findOneAndUpdate({mealName: req.params.name, owner:curUsername}, req.body, { runValidators: true});
    await cloudinary.uploader.destroy(getPublicId(oldMeal.imgSrc));
    req.flash('success', `${req.body.mealName} has changed!`);
    res.redirect('/meals')
    tags = []
    ingredients = []
}

export const deleteMeal =  async (req, res) => {
    const { id } = req.params;
    const oldMeal = await Meals.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(getPublicId(oldMeal.imgSrc));
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
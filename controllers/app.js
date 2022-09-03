import Pantry from "../models/pantry.js"
import Meals from "../models/meal.js"

let choices = []
let matchedMeals = []
const choiceArr = [["Healthy","Regular"],["Breakfast","Lunch","Dinner"],["Dairy","Parve","Meaty"]]

export const renderApp = async (req, res) => {
    res.render('app/first-page', { choiceArr })
    choices = []
    matchedMeals = []
}

export const processChoice = async (req, res) => {
    const choice = req.params.choice
    const curUsername = res.locals.currentUser.username
    if (!choices.includes(choice.toLowerCase())) choices.push(choice.toLowerCase())
    if (choiceArr[0].includes(choice)){
        res.render('app/second-page', { choiceArr })
        }
    else if (choiceArr[1].includes(choice)) {
        res.render('app/third-page', { choiceArr })}
    else {
        await findMatchedMeal(choices, curUsername)
        res.render('app/filtered-page', { matchedMeals })
    }
}

async function findMatchedMeal (choices, curUser) {
    console.log(curUser)
    let healthMatch = false, mealMatch = false, genreMatch = false, ingMatch = true
    const meals = await Meals.find({owner:curUser})
    console.log(meals)
    const pantryItems = await Pantry.find({inStock:true, owner:curUser})
    console.log(pantryItems)
    for (let meal of meals) {
        const sortedTags = sortTags(meal.tags)
        console.log(sortedTags)
        for (let ch of choices) {
            if (sortedTags["healthTags"].includes(ch)) healthMatch = true
            if (sortedTags["mealTags"].includes(ch)) mealMatch = true
            if (sortedTags["genreTags"].includes(ch)) genreMatch = true
            }
        let ingredients = []
        for (let item of pantryItems) ingredients.push(item.name.toLowerCase())
        for (let ingredient of meal.ingredients) {
            if (!ingredients.includes(ingredient.toLowerCase())) ingMatch = false
            if (ingredients.includes(ingredient.toLowerCase() + 's')) ingMatch = true
            if (ingredients.includes(ingredient.toLowerCase().slice(0,-1))) ingMatch = true
        }
        if (healthMatch && mealMatch && genreMatch && ingMatch) {
            matchedMeals.push(meal)
        }
        healthMatch = false; mealMatch = false; genreMatch = false; ingMatch = true; 
        console.log("test:", matchedMeals)
    }
}

function sortTags(tags) {
    let sortedTags = {"healthTags":[], "mealTags":[], "genreTags":[]}
    for (let tag of tags) {
        if (tag === "healthy" || tag === "regular") sortedTags["healthTags"].push(tag)
        else if (tag === "breakfast" || tag === "lunch" || tag === "dinner") sortedTags["mealTags"].push(tag)
        else if (tag === "dairy" || tag === "parve" || tag === "meaty") sortedTags["genreTags"].push(tag)
    }
    return sortedTags
}
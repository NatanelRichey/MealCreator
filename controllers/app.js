import Pantry from "../models/pantry.js"
import Meals from "../models/meal.js"

let choices = []
let matchedMeals = []
const choiceArr = [["Healthy","Regular"],["Breakfast","Lunch","Dinner"],["Dairy","Parve","Meaty"]]

export const renderHome = async (req, res) => {
    res.render('/login')
}

export const renderApp = async (req, res) => {
    res.render('app/first-page', { choiceArr })
    choices = []
    matchedMeals = []
}

export const processChoice = async (req, res) => {
    const choice = req.params.choice
    console.log("CHOICE...", choice)
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
    console.log("CHOICES...", choices)
}

async function findMatchedMeal (choices, curUser) {
    console.log("CUR USER...", curUser, "CHOICES...", choices)
    let healthMatch = false, mealMatch = false, genreMatch = false, ingMatch = true
    const meals = await Meals.find({owner:curUser})
    // console.log("MEALS...", meals)
    const pantryItems = await Pantry.find({inStock:true, owner:curUser})
    // console.log(pantryItems)
    for (let meal of meals) {
        const sortedTags = sortTags(meal.tags)
        console.log("SORTED TAGS...", sortedTags)
        for (let ch of choices) {
            ch = ch.toLowerCase()
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
            for (let i = 0; i < 10; i++) { matchedMeals.push(meal)}
        }
        healthMatch = false; mealMatch = false; genreMatch = false; ingMatch = true; 
    }
}

function sortTags(tags) {
    let sortedTags = {"healthTags":[], "mealTags":[], "genreTags":[]}
    console.log("TAGS...", tags)
    for (let tag of tags) {
        console.log("TAG...", tag)
        tag = tag.toLowerCase()
        if (tag === "healthy" || tag === "regular") sortedTags["healthTags"].push(tag)
        else if (tag === "breakfast" || tag === "lunch" || tag === "dinner") sortedTags["mealTags"].push(tag)
        else if (tag === "dairy" || tag === "parve" || tag === "meaty") sortedTags["genreTags"].push(tag)
    }
    return sortedTags
}
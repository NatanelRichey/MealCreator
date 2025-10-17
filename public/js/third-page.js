const dairyButton = document.querySelector(".dairy")
const prvButton = document.querySelector(".parve")
const meatButton = document.querySelector(".meaty")

dairyButton.addEventListener('click', function () {
    choices.genreChoice = "dairy"
    location.href = "/filtered-page"
    findMatchedMeal()
    addMealToPage()
})

prvButton.addEventListener('click', function () {
    choices.genreChoice = "parve"
    location.href = "/filtered-page"
    findMatchedMeal()
    addMealToPage()
})

meatButton.addEventListener('click', function () {
    choices.genreChoice = "meaty"
    location.href = "/filtered-page"
    findMatchedMeal()
    addMealToPage()
})

function findMatchedMeal () {
    let healthMatch = false, mealMatch = false, genreMatch = false, ingMatch = true
    for (let [name,dict] of Object.entries(meals)) {
        for (let tag of Object.values(dict)[1]) {
            if (choices.healthChoice === tag) healthMatch = true
            else if (choices.mealChoice === tag) mealMatch = true
            else if (choices.genreChoice === tag) genreMatch = true
        }
        for (let ingredient of Object.values(dict)[0]) {
            if (!pantry.includes(ingredient)) ingMatch = false
            if (pantry.includes(ingredient + 's')) ingMatch = true
            if (pantry.includes(ingredient.slice(0,-1))) ingMatch = true
        }
        if (healthMatch && mealMatch && genreMatch && ingMatch) {
            matchedMeals[name] = Object.values(dict)[2]
        }
        // console.log (name, ":\n", "health match: ", healthMatch, "meal match: ", mealMatch, "genre match: ", genreMatch, "ingredient match: ", ingMatch)
        healthMatch = false; mealMatch = false; genreMatch = false; 
    }
}

function addMealToPage () {
    for (let [name,url] of Object.entries(matchedMeals)) {
        let newMeal = document.createElement("div")
        newMeal.setAttribute("class","col-sm-3 d-flex justify-content-begin")
        newMeal.innerHTML = `<button class="btn btn-default selection-button-meal" id = "matched-meal-btn">
                                <img src=${url} class="selection-images img-fluid" id = "matched-meal-image"/> 
                                <div class="matched-meal-txt">${name}</div>
                            </button>`
        matchedMealRow.appendChild(newMeal)
    }
}
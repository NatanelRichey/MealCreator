const mealsFormPage = document.querySelector('.meals-form-cont')
const addIngredientButton = document.querySelector(".add-ingredient-button")
let remIngredientButton = document.querySelector(".ingredient-row")
const doneFormButton = document.querySelector(".done-button.add-ingredient-button")
const cancelFormButton = document.querySelector(".cancel-button.add-ingredient-button")
let mealFormContainer = document.querySelector(".meals-form-cont")
const mealsMenuContainer = document.querySelector(".meals-menu-cont")

let ingredients = []
let tags = []

mealFormContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "meal-form-category ingredient-field") {
        addIngredient(e.target.parentElement.nextElementSibling.firstElementChild)
    }
})

mealFormContainer.addEventListener('click', function (e) {
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light meal-edit tag-list-check filter") {
        e.target.classList.remove("filter")
        const tagName = e.target.nextElementSibling.innerText
        if (!(tags.includes(tagName))) tags.push(tagName)
    }
    else if (e.target.className === "btn btn-light meal-edit tag-list-check") {
        e.target.classList.add("filter")
        // console.log(e.target.nextElementSibling.innerText)
        tags = arrayRemove(tags, e.target.nextElementSibling.innerText)
    }

    if (e.target.nodeName === "INPUT" && e.target.className === "add-ingredient-button") {
        addIngredient(e.target)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "cancel-button") {
        location.href = "/meals"
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "done-button add-ingredient-button") {
        let newItem = addNewMealToList()
    }

    if (e.target.nodeName === "INPUT" && e.target.className === "cancel-tag") {
        e.target.parentElement.parentElement.style.visibility = "hidden";
    }
})

function addNewMealToList() {
    // Definitions
    let mealName = document.querySelector(".name-field")
    let ingredientRow = document.querySelector(".ingredient-row")
    let selectedButtons = document.querySelectorAll(".btn.btn-light.meal.tag-list-check")
    let imgSrc = undefined

    // Get Image Url from form
    if (document.querySelector(".file-form-button.form-control").files.length !== 0) {
        imgSrc = "meal-images/" + document.querySelector(".file-form-button.form-control").files[0].name
    }
    else
        imgSrc = "meal-images/empty-plate.jpg"

    // Get tags from form 
    let tagsList = []
    for (let tag of selectedButtons) {
        if (!tag.className.includes("filter"))
            tagsList.push(tag.nextElementSibling.innerText.toLowerCase())
    }

    // Get ingredients from form
    let ingredientList = []
    for (let ingredient of ingredientRow.children) {
        ingredientList.push(ingredient.innerText.toLowerCase())
    }

    // Add meal name and ingredients to Dictionary
    innerDict = {}
    innerDict["ingredients"] = ingredientList
    innerDict["tags"] = tagsList
    innerDict["imgSrc"] = imgSrc
    meals[mealName.value.toLowerCase()] = innerDict

    // console.log (meals)

    // Add new meal to meals page
    let newItem = document.createElement("div")
    if (curColor === "grey") {
        newItem.setAttribute("class", `row meal-list-item bar-1 m-0 ${mealName.value}`)
        curColor = "green"
    }
    else {
        newItem.setAttribute(`class", "row meal-list-item bar-2 m-0 ${mealName.value}`)
        curColor = "grey"
    }
    curNumber++
    newItem.innerHTML = `<div class="col-sm-2 d-flex justify-content-start align-items-center p-0 meal-img-col">
                                <img class="meal-img" src="${imgSrc}">
                            </div>
                            <div class="col-sm-9 p-0 meal-search-col">
                                <input type="search" class="meal-item-edit" value="${mealName.value}" placeholder="${mealName.value}">
                            </div>
                            <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                                <button class="btn btn-light tick-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
    return newItem
}

function addIngredient(target) {
    let ingredientField = target.parentElement.previousElementSibling.firstElementChild
    let ingredientRow = target.parentElement.parentElement.nextElementSibling
    let newForm = document.createElement("form")
    newForm.setAttribute("class", "d-block ingredient-form") 
    newForm.setAttribute("action", `/meals/new/ingredients/${ingredientField.value}?_method=DELETE`) 
    newForm.setAttribute("method", "post") 
    let newTag = document.createElement("div")
    newTag.setAttribute("class", "tag d-flex align-items-center") 
    newTag.setAttribute("id", "ingredient-tag") 
    newTag.innerText = `${ingredientField.value}`
    newTag.innerHTML += '<input type="image" class="cancel-tag" src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/cancel.png" value="">'
    newForm.appendChild(newTag)
    ingredientRow.appendChild(newForm)
}

function arrayRemove (arr, value) { 
    return arr.filter(function (elem) { return elem != value })
}
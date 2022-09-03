let choices = {
    healthChoice:"",
    mealChoice:"",
    genreChoice:"",
}

let meals = { 
    "pizza": {"ingredients":["cheese", "tomato sauce", "dough", "corn", "mushrooms"], "tags": ["regular", "breakfast", "lunch", "dinner", "dairy"], "imgSrc": "meal-images/pizza.jpg"},
    "burritos": {"ingredients":["tortilla", "beans", "cheese", "corriander"], "tags": ["regular", "lunch", "dinner", "dairy"], "imgSrc": "meal-images/burrito.jpg"},
    "fried egg": {"ingredients":["egg"], "tags": ["healthy", "breakfast", "lunch", "dinner", "parve"], "imgSrc": "meal-images/fried-egg.jpg"},
    "vanilla cake": {"ingredients":["cake mix", "egg", "milk"], "tags": ["regular", "breakfast", "parve"], "imgSrc": "meal-images/vanilla-cake.jpg"},
    "green curry": {"ingredients":["corriander", "parsley", "chicken", "coconut milk"], "tags": ["healthy", "dinner", "meaty"], "imgSrc": "meal-images/green-curry.jpg"},
    "sfinge": {"ingredients":["flour", "eggs", "yeast", "oil"], "tags": ["regular", "breakfast", "parve"], "imgSrc": "meal-images/sfinge.webp"},
    "pasta": {"ingredients":["pasta", "tomato paste", "basil", "garlic"], "tags": ["regular", "lunch", "dinner", "parve"], "imgSrc": "meal-images/pasta.jpg"},
    "tuna burgers": {"ingredients":["tuna", "quinoa", "onions", "parsley"], "tags": ["healthy", "lunch", "dinner", "parve"], "imgSrc": "meal-images/tuna-burger.webp"},
    "falafel": {"ingredients":["chickpeas", "corriander", "olive oil", "garlic"], "tags": ["healthy", "lunch", "dinner", "parve"], "imgSrc": "meal-images/falafel.jpg"},
    "shnitzel": {"ingredients":["chicken", "bread crumbs", "egg", "flour"], "tags": ["regular", "lunch", "dinner", "meaty"], "imgSrc": "meal-images/shnitzel.jpg"}
}

let pantry = []
const pantryCheckedItems = document.querySelectorAll('.col-sm-9.p-0.pantry-input-field')
for (item of pantryCheckedItems) {
    pantry.push(item.firstElementChild.value.toLowerCase())  
} 

let matchedMeals = {}

let curColor = "grey"
let curNumber = 10

let curName = undefined

let curEditElement = undefined
let curImgSrc = undefined

let mealElems = document.querySelectorAll(".meal-list-item")
const mealsMenuContainer = document.querySelector(".meals-menu-cont")
setMealBgColor()


const homePage = document.querySelector('.home-page-cont')
const secondPage = document.querySelector('.second-page-cont')
const thirdPage = document.querySelector('.third-page-cont')
const fourthPage = document.querySelector('.fourth-page-cont')
const pantryPage = document.querySelector('.pantry-page-cont')
const listPage = document.querySelector('.list-page-cont')
const mealsPage = document.querySelector('.meals-page-cont')
const mealsFormPage = document.querySelector('.meals-form-cont')
let curPage = homePage
let matchedMealRow = document.querySelector(".matched-meal-row")

const healthyButton = document.querySelector("#healthy-button")
const regularButton = document.querySelector("#regular-button")
const brkButton = document.querySelector("#brk-button")
const lunchButton = document.querySelector("#lunch-button")
const dnrButton = document.querySelector("#dnr-button")
const dairyButton = document.querySelector("#dairy-button")
const prvButton = document.querySelector("#prv-button")
const meatButton = document.querySelector("#meat-button")
const backButtonMeal = document.querySelector("#back-button-meal")
const backButtonGnr = document.querySelector("#back-button-genre")
const homeButton = document.querySelector("#home-button")
const logoButton = document.querySelector("#logo-name-button")
const pantryButton = document.querySelector("#pantry-button")
const listButton = document.querySelector("#list-button")


const mealButton = document.querySelector("#meal-button")
const addMealButton = document.querySelector(".add-meal-button")
const addMealBtn = document.querySelector(".add-meal-btn")
const addIngredientButton = document.querySelector(".add-ingredient-button")
let remIngredientButton = document.querySelector(".ingredient-row")
const doneFormButton = document.querySelector(".done-button.add-ingredient-button")
const cancelFormButton = document.querySelector(".cancel-button.add-ingredient-button")
const cancelEditButton = document.querySelector(".edit.cancel-button")
const mealSearchButton = document.querySelector(".search-btn")
const mealPageContainer = document.querySelector(".meals-page-cont")
const mealSearchBar = document.querySelector(".meal-search-category")
let mealFormContainer = document.querySelector(".meals-form-cont")
let mealEditContainer = document.querySelector(".meals-edit-cont")
const doneEditFormButton = document.querySelector(".done-button.edit.add-ingredient-button")

const addPantryButtons = document.querySelectorAll(".add-pantry-button")
const pantryCategories = document.querySelectorAll(".pantry-category")
const listCategories = document.querySelectorAll(".list-category")
const editItemButtons = document.querySelectorAll(".item-edit")
const itemEnterButtons = document.querySelectorAll(".tick-btn")
const itemTrashButtons = document.querySelectorAll(".trash-btn")
const overlay = document.querySelector(".overlay")
const searchPantryButtons = document.querySelectorAll(".search-category")
const pantryPageContainer = document.querySelector(".pantry-page-cont")
const savedItemsSection = document.querySelector(".saved-items-section")
const savedItemsSectionList = document.querySelector(".saved-items-section.list-category")
let listItems = document.querySelectorAll(".list-item-bar")
const listPageContainer = document.querySelector(".list-page-cont")

let curEditInnerHtml = mealEditContainer.innerHTML
let curFormInnerHtml = mealFormContainer.innerHTML


healthyButton.addEventListener('click', function () {
    homePage.style.display = "none"
    secondPage.style.display = "block"
    curPage = secondPage
    choices.healthChoice = "healthy"
})

regularButton.addEventListener('click', function () {
    homePage.style.display = "none"
    secondPage.style.display = "block"
    curPage = secondPage
    choices.healthChoice = "regular"
})

brkButton.addEventListener('click', function () {
    secondPage.style.display = "none"
    choices.mealChoice = "breakfast"
    thirdPage.style.display = "block"
    curPage = thirdPage
})

lunchButton.addEventListener('click', function () {
    thirdPage.style.display = "block"
    secondPage.style.display = "none"
    choices.mealChoice = "lunch"
    curPage = thirdPage
})

dnrButton.addEventListener('click', function () {
    thirdPage.style.display = "block"
    secondPage.style.display = "none"
    choices.mealChoice = "dinner"
    curPage = thirdPage 
})

dairyButton.addEventListener('click', function () {
    thirdPage.style.display = "none"
    fourthPage.style.display = "block"
    curPage = fourthPage
    choices.genreChoice = "dairy"
    findMatchedMeal()
    addMealToPage()
})

prvButton.addEventListener('click', function () {
    thirdPage.style.display = "none"
    fourthPage.style.display = "block"
    curPage = fourthPage
    choices.genreChoice = "parve"
    findMatchedMeal()
    addMealToPage()
})

meatButton.addEventListener('click', function () {
    thirdPage.style.display = "none"
    fourthPage.style.display = "block"
    curPage = fourthPage
    choices.genreChoice = "meaty"
    findMatchedMeal()
    addMealToPage()
})

backButtonMeal.addEventListener('click', function () { 
    secondPage.style.display = "none"
    homePage.style.display = "block"
    choices.healthChoice = ""
    curPage = homePage 
})

backButtonGnr.addEventListener('click', function () {
    thirdPage.style.display = "none" 
    secondPage.style.display = "block"
    choices.mealChoice = ""
    curPage = secondPage
})

homeButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    curPage.style.display = "none"
    homePage.style.display = "block"
    curPage = homePage
    homeButton.classList.add('selected')
    pantryButton.classList.remove('selected')
    listButton.classList.remove('selected')
    mealButton.classList.remove('selected')
    resetPage()
})

logoButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    curPage = homePage
})

pantryButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    curPage.style.display = "none"
    pantryPage.style.display = "block"
    curPage = pantryPage
    homeButton.classList.remove('selected')
    pantryButton.classList.add('selected')
    listButton.classList.remove('selected')
    mealButton.classList.remove('selected')
})

listButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    curPage.style.display = "none"
    listPage.style.display = "block"
    curPage = listPage
    homeButton.classList.remove('selected')
    pantryButton.classList.remove('selected')
    listButton.classList.add('selected')
    mealButton.classList.remove('selected')
})

mealButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    curPage.style.display = "none"
    mealsPage.style.display = "block"
    curPage = mealsPage
    homeButton.classList.remove('selected')
    pantryButton.classList.remove('selected')
    listButton.classList.remove('selected')
    mealButton.classList.add('selected')
})

mealPageContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "meal-search-category") {
        searchMealList(e.target.nextElementSibling)
    }

    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "meal-item-edit") {
        let item = e.target
        delete Object.assign(meals, {[item.value.toLowerCase()]: meals[item.placeholder.toLowerCase()] })[item.placeholder.toLowerCase()];
        let enteredText = item.value
        item.placeholder = enteredText
        item.value = enteredText
        e.target.blur()
        changeButtonsMeal(e, "hide")
        hideRestButtonsMeal(e)
    }
})

mealPageContainer.addEventListener('click', function (e) {
    // console.log(e)
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light search-btn") {
        searchMealList(e.target)
    }

    if (e.target.nodeName === "DIV" && e.target.className === "add-meal-btn") {
        hideRestButtonsMeal("all")
        resetForm("form")
        mealsPage.style.display = "none"
        mealsFormPage.style.display = "block"
        curPage = mealsFormPage
    }
    
    if (e.target.nodeName === "INPUT" && e.target.className === "meal-item-edit") {
        changeButtonsMeal(e, "show")
        hideRestButtonsMeal(e)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tick-btn") {
        let item = e.target.parentElement.previousElementSibling.firstElementChild
        delete Object.assign(meals, {[item.value.toLowerCase()]: meals[item.placeholder.toLowerCase()] })[item.placeholder.toLowerCase()];
        console.log(meals)
        let enteredText = item.value
        item.placeholder = enteredText
        item.value = enteredText
        changeButtonsMeal(e, "hide")
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light trash-btn") {
        let elemToDel = e.target.parentElement.parentElement
        let elemToDelName = e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.value
        let categoryList = e.target.parentElement.parentElement.parentElement
        categoryList.removeChild(elemToDel)
        setMealBgColor()
        curNumber--
        delete meals[elemToDelName.toLowerCase()]
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light add-meal-button d-flex justify-content-begin align-items-center p-0") {
        hideRestButtonsMeal("all")
        resetForm("form")
        mealsPage.style.display = "none"
        mealsFormPage.style.display = "block"
        curPage = mealsFormPage
    }
    if (e.target.nodeName == "INPUT" && e.target.className === "meal-search-category") hideRestButtonsMeal("all") 
    if (e.target.nodeName == "SPAN" && e.target.className === "add-meal-txt") {
        resetForm("form")
        hideRestButtonsMeal("all") 
        mealsPage.style.display = "none"
        mealsFormPage.style.display = "block"
        curPage = mealsFormPage
    }
    if (e.target.nodeName == "DIV" && e.target.className === "overlay") hideRestButtonsMeal("all") 

    if (e.target.nodeName === "IMG" && e.target.className === "meal-img") {
        mealsPage.style.display = "none"
        mealEditContainer.style.display = "block"
        curPage = mealEditContainer
        curName = e.target.parentElement.nextElementSibling.firstElementChild.value
        editMealInList(e.target)
        console.log("e.target: ", e.target)
    }
})

mealFormContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "meal-form-category ingredient-field") {
        addIngredient(e.target.parentElement.nextElementSibling.firstElementChild)
    }
})

mealFormContainer.addEventListener('click', function (e) {
    // console.log(e)
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light meal tag-list-check filter") e.target.classList.remove("filter")
    else if (e.target.className === "btn btn-light meal tag-list-check") e.target.classList.add("filter")

    if (e.target.nodeName === "BUTTON" && e.target.className === "add-ingredient-button") {
        addIngredient(e.target)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "cancel-button add-ingredient-button") {
        mealsFormPage.style.display = "none"
        mealsPage.style.display = "block"
        curPage = mealsPage
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "done-button add-ingredient-button") {
        mealFormContainer.style.display = "none"
        mealsPage.style.display = "block"
        curPage = mealsPage
        let newItem = addNewMealToList()
        mealsMenuContainer.appendChild(newItem)
        resetForm("form")
    }

    if (e.target.nodeName === "IMG" && e.target.className === "cancel-tag") e.target.parentElement.remove()
    
})

mealEditContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "meal-form-category ingredient-field") {
        addIngredient(e.target.parentElement.nextElementSibling.firstElementChild)
    }
})

mealEditContainer.addEventListener('click', function (e) {
    // console.log(e)
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light meal-edit tag-list-check filter") e.target.classList.remove("filter")
    else if (e.target.className === "btn btn-light meal-edit tag-list-check") e.target.classList.add("filter")

    if (e.target.nodeName === "BUTTON" && e.target.className === "add-ingredient-button") {
        addIngredient(e.target)
    }
    if (e.target.nodeName === "IMG" && e.target.className === "cancel-tag") e.target.parentElement.remove()

    if (e.target.nodeName === "BUTTON" && e.target.className === "done-button edit add-ingredient-button") {
        mealEditContainer.style.display = "none"
        mealsPage.style.display = "block"
        curPage = mealsPage
    
        let mealName = document.querySelector(".meal-form-category.edit.name-field")
        let ingredientRow = document.querySelector(".row.d-flex.justify-content-center.edit-ingredient-row")
        let selectedButtons = document.querySelectorAll(".btn.btn-light.meal-edit.tag-list-check")
        let imgSrc = undefined
    
        // Get Image Url from form
        if (document.querySelector(".file-form-button.edit.form-control").files.length !== 0) {
            imgSrc = "meal-images/" + document.querySelector(".file-form-button.edit.form-control").files[0].name
        }
        else
            imgSrc = curImgSrc
    
        // Get tags from form 
        let tagsList = []
        for (tag of selectedButtons) {
            if (!tag.className.includes("filter"))
                tagsList.push(tag.nextElementSibling.innerText.toLowerCase())
        }
    
        // Get ingredients from form
        let ingredientList = []
        for (ingredient of ingredientRow.children) {
            ingredientList.push(ingredient.innerText.toLowerCase())
        }
        
        // Add meal name and ingredients to Dictionary
        innerDict = {}
        innerDict["ingredients"] = ingredientList
        innerDict["tags"] = tagsList
        innerDict["imgSrc"] = imgSrc
        meals[mealName.value.toLowerCase()] = innerDict

        // console.log(meals)
    
        // change existing meal to meals page
        curEditElement.innerHTML = `<div class="col-sm-2 d-flex justify-content-start align-items-center p-0 meal-img-col">
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
        resetForm("edit")
        if (curName !== mealName.value) delete meals[curName.toLowerCase()]
        console.log(meals)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "cancel-button edit add-ingredient-button") {
        mealEditContainer.style.display = "none"
        mealsPage.style.display = "block"
        curPage = mealsPage
        resetForm("edit")
    }
})

pantryPageContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "search-category") {
        addNewItem(e.target.nextElementSibling)
    }

    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        let item = e.target.parentElement.nextElementSibling.firstElementChild
        let index = pantry.indexOf(e.target.placeholder.toLowerCase());
        if (~index) {
            pantry[index] = e.target.value.toLowerCase();
        }
        let enteredText = item.value
        item.placeholder = enteredText
        item.value = enteredText
        changeButtons (e, "hide")
        e.target.blur()
    }
})

pantryPageContainer.addEventListener('click', function (e) {
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light add-button add-pantry-button d-flex justify-content-center align-items-center p-0") {
        addNewItem(e.target)
    }   

    if (e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        changeButtons(e, "show")
        hideRestButtons (e)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tick-btn") {
        editItemName(e.target)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light trash-btn") {
        let elemToDel = e.target.parentElement.parentElement
        let elemName = e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.value
        let categoryList = e.target.parentElement.parentElement.parentElement
        categoryList.removeChild(elemToDel);
        pantry = arrayRemove(pantry, elemName.toLowerCase())
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tag-list-check") {
        let elemToDel = e.target.parentElement.parentElement
        let categoryList = e.target.parentElement.parentElement.parentElement
        categoryList.removeChild(elemToDel); 
        let itemName = e.target.parentElement.nextElementSibling.firstElementChild.value
        let newItem = document.createElement("div")
        newItem.setAttribute("class","row list-item-bar m-0")
        newItem.setAttribute("title", categoryList.className)
        newItem.innerHTML = `<div class="col-sm-1 d-flex justify-content-begin align-items-center p-0 check-col">
                                <button class="btn btn-light tag-list-uncheck"></button>  
                            </div>
                            <div class="col-sm-9 p-0">
                                <input type="search" class="item-edit" value="${itemName}" placeholder="${itemName}">
                            </div>
                            <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                                <button class="btn btn-light tick-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
        savedItemsSection.appendChild(newItem)
        pantry = arrayRemove(pantry, itemName.toLowerCase())
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tag-list-uncheck") {
        let elemToDel = e.target.parentElement.parentElement
        let className = '.' + elemToDel.title.replace(/ /g, '.')
        let categoryList = document.querySelector(className)
        savedItemsSection.removeChild(elemToDel); 
        let itemName = e.target.parentElement.nextElementSibling.firstElementChild.value
        let newItem = document.createElement("div")
        newItem.setAttribute("class","row list-item-bar m-0")
        newItem.setAttribute("title", elemToDel.title)
        newItem.innerHTML = `<div class="col-sm-1 d-flex justify-content-begin align-items-center p-0 check-col">
                                <button class="btn btn-light tag-list-check"></button>  
                            </div>
                            <div class="col-sm-9 p-0 pantry-input-field">
                                <input type="search" class="item-edit" value="${itemName}" placeholder="${itemName}">
                            </div>
                            <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                                <button class="btn btn-light tick-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
        categoryList.appendChild(newItem)
        pantry.push(itemName.toLowerCase())
    }

    if (e.target.nodeName == "INPUT" && e.target.className === "search-category") hideRestButtons ("all") 
    if (e.target.nodeName == "DIV" && e.target.className === "overlay") hideRestButtons ("all") 
})

listPageContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "search-category") {
        addNewItem(e.target.nextElementSibling)
    }

    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        let item = e.target.parentElement.nextElementSibling.firstElementChild
        let enteredText = item.value
        item.placeholder = enteredText
        item.value = enteredText
        changeButtons (e, "hide")
        e.target.blur()
    }
})

listPageContainer.addEventListener('click', function (e) {
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light add-button add-pantry-button d-flex justify-content-center align-items-center p-0") {
        let pantrySection = e.target.parentElement.parentElement.parentElement
        let searchField = e.target.previousElementSibling
        let newItem = document.createElement("div")
        newItem.setAttribute("class","row list-item-bar m-0")
        newItem.setAttribute("title", pantrySection.className)
        newItem.innerHTML = `<div class="col-sm-1 d-flex justify-content-begin align-items-center p-0 check-col">
                                <button class="btn btn-light tag-list-check"></button>  
                            </div>
                            <div class="col-sm-9 p-0">
                                <input type="search" class="item-edit" value="${searchField.value}" placeholder="${searchField.value}">
                            </div>
                            <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                                <button class="btn btn-light tick-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
        pantrySection.appendChild(newItem)
        searchField.value = ""
        hideRestButtons ("all")
    }   

    if (e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        changeButtons(e, "show")
        hideRestButtons (e)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tick-btn") {
        let item = e.target.parentElement.previousElementSibling.firstElementChild
        let enteredText = item.value
        item.placeholder = enteredText
        item.value = enteredText
        changeButtons (e, "hide")
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light trash-btn") {
        let elemToDel = e.target.parentElement.parentElement
        let categoryList = e.target.parentElement.parentElement.parentElement
        categoryList.removeChild(elemToDel);
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tag-list-check") {
        let elemToDel = e.target.parentElement.parentElement
        let categoryList = e.target.parentElement.parentElement.parentElement
        categoryList.removeChild(elemToDel); 
        let itemName = e.target.parentElement.nextElementSibling.firstElementChild.value
        let newItem = document.createElement("div")
        newItem.setAttribute("class","row list-item-bar m-0")
        newItem.setAttribute("title", categoryList.className)
        newItem.innerHTML = `<div class="col-sm-1 d-flex justify-content-begin align-items-center p-0 check-col">
                                <button class="btn btn-light tag-list-uncheck"></button>  
                            </div>
                            <div class="col-sm-9 p-0">
                                <input type="search" class="item-edit" value="${itemName}" placeholder="${itemName}">
                            </div>
                            <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                                <button class="btn btn-light tick-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
        savedItemsSectionList.appendChild(newItem)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light tag-list-uncheck") {
        let elemToDel = e.target.parentElement.parentElement
        let className = '.' + elemToDel.title.replace(/ /g, '.')
        let categoryList = document.querySelector(className)
        savedItemsSectionList.removeChild(elemToDel); 
        let itemName = e.target.parentElement.nextElementSibling.firstElementChild.value
        let newItem = document.createElement("div")
        newItem.setAttribute("class","row list-item-bar m-0")
        newItem.setAttribute("title", elemToDel.title)
        newItem.innerHTML = `<div class="col-sm-1 d-flex justify-content-begin align-items-center p-0 check-col">
                            <button class="btn btn-light tag-list-check"></button>  
                        </div>
                        <div class="col-sm-9 p-0 pantry-input-field">
                            <input type="search" class="item-edit" value="${itemName}" placeholder="${itemName}">
                        </div>
                        <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                            <button class="btn btn-light tick-btn"></button> 
                        </div>
                        <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                            <button class="btn btn-light trash-btn"></button> 
                        </div>`
        categoryList.appendChild(newItem)
    }

    if (e.target.nodeName == "INPUT" && e.target.className === "search-category") hideRestButtons ("all") 
    if (e.target.nodeName == "DIV" && e.target.className === "overlay") hideRestButtons ("all") 
})

function setMealBgColor() {
    mealElems = document.querySelectorAll(".meal-list-item")
    for (let i = 0; i < mealElems.length; i++) {
        if (i % 2 === 0) {
            mealElems[i].classList.remove("bar-2")
            mealElems[i].classList.remove("bar-1")
            mealElems[i].classList.add("bar-1")
        }
        else if ( i % 2 === 1) {
            mealElems[i].classList.remove("bar-1")
            mealElems[i].classList.remove("bar-2")
            mealElems[i].classList.add("bar-2")
        }
    }
}

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
    for (tag of selectedButtons) {
        if (!tag.className.includes("filter"))
            tagsList.push(tag.nextElementSibling.innerText.toLowerCase())
    }

    // Get ingredients from form
    let ingredientList = []
    for (ingredient of ingredientRow.children) {
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

function editMealInList(target) {
    // Get existing data
    curImgSrc = target["src"]
    curEditElement = target.parentElement.parentElement
    let curName = target.parentElement.nextElementSibling.firstElementChild.value
    console.log(curName)
    document.querySelector(".meal-form-category.edit.name-field").placeholder = curName
    document.querySelector(".meal-form-category.edit.name-field").value = curName
    console.log (document.querySelector(".meal-form-category.edit.name-field").placeholder, document.querySelector(".meal-form-category.edit.name-field").value)
    let curIngredientList = meals[curName.toLowerCase()]["ingredients"]
    for (ingredient of curIngredientList) {
        editIngredient(ingredient)
    }
    let curTagList = meals[curName.toLowerCase()]["tags"]
    for (tagElement of document.querySelectorAll(".btn.btn-light.meal-edit.tag-list-check.filter")) {
        for (savedTag of curTagList) {
            if (tagElement.nextElementSibling.innerText.toLowerCase() === savedTag) {
                tagElement.classList.remove("filter")
            } 
        }
    }
}

function addIngredient(target) {
    let ingredientField = target.parentElement.previousElementSibling.firstElementChild
    let ingredientRow = target.parentElement.parentElement.nextElementSibling
    let newTag = document.createElement("div")
    newTag.setAttribute("class", "tag col-md-4 d-flex align-items-center")
    newTag.innerText = `${ingredientField.value}`
    newTag.innerHTML += `<img class="cancel-tag" src="icons/cancel.png">`
    ingredientRow.appendChild(newTag)
    ingredientField.value = ""
}

function editIngredient (ingredient) {
    let ingredientRow = document.querySelector(".row.d-flex.justify-content-center.edit-ingredient-row")
    let newTag = document.createElement("div")
    newTag.setAttribute("class", "tag col-md-4 d-flex align-items-center")
    newTag.innerText = `${ingredient}`
    newTag.innerHTML += `<img class="cancel-tag" src="icons/cancel.png">`
    ingredientRow.appendChild(newTag)
}

function searchMealList(target) {
    elemNotFound = true
    mealElems = document.querySelectorAll(".meal-list-item")
    let searchEntry = target.previousElementSibling
    let findClassName = ""
    for (let meal of mealElems) {
        if (meal.children[1].firstElementChild.value.toLowerCase().includes(searchEntry.value.toLowerCase())) {
            for (let classElem of meal.classList) {
                findClassName += ('.' + classElem)
            }
            elemNotFound = false
            break
        }
    }
    if (searchEntry.value === "" || elemNotFound) {
        mealSearchBar.setAttribute("placeholder", "Not Found!")
        setTimeout(() => mealSearchBar.setAttribute("placeholder", "Enter a Meal"), 1000)
        searchEntry.value = ""
    }
    else {
        console.log(findClassName)
        let foundElem = document.querySelector(findClassName)
        foundElem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        foundElem.setAttribute("id", "bg-color-change")
        setTimeout(() => foundElem.removeAttribute("id", "bg-color-change"), 1000)
    }
    hideRestButtonsMeal("all")
}

function editItemName(target) {
    let item = target.parentElement.previousElementSibling.firstElementChild
    let index = pantry.indexOf(item.placeholder.toLowerCase());
    if (~index) {
        pantry[index] = item.value.toLowerCase();
    }
    // console.log (item.placeholder, item.value, index)
    let enteredText = item.value
    item.value = enteredText
    item.placeholder = enteredText
    item.blur()
}

function addNewItem(target) {
    let pantrySection = target.parentElement.parentElement.parentElement
    let searchField = target.previousElementSibling
    let newItem = document.createElement("div")
    newItem.setAttribute("class", "row list-item-bar m-0")
    newItem.setAttribute("title", pantrySection.className)
    newItem.innerHTML = `<div class="col-sm-1 d-flex justify-content-begin align-items-center p-0 check-col">
                                <button class="btn btn-light tag-list-check"></button>  
                            </div>
                            <div class="col-sm-9 p-0 pantry-input-field">
                                <input type="search" class="item-edit" value="${searchField.value}" placeholder="${searchField.value}">
                            </div>
                            <div class="col-sm-1 d-flex justify-content-end align-items-center p-0">
                                <button class="btn btn-light tick-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
    pantrySection.appendChild(newItem)
    pantry.push(searchField.value.toLowerCase())
    searchField.value = ""
    hideRestButtons("all")
}

function changeButtons (e, action) {
    let node = undefined
    if (e.nodeType === 1) node = e
    else {
        node = e.target
        while (node.className !== "row list-item-bar m-0") {
            node = node.parentElement
        }
    }
    for (child of node.children)
        {
            if (child.className === 'col-sm-1 d-flex justify-content-end align-items-center p-0') { 
                if (action === "hide") {
                    child.firstElementChild.style.display = "none"; 
                }
                else {child.firstElementChild.style.display = "block"}
            }
            if (child.className === 'col-sm-1 d-flex justify-content-center align-items-center p-0') {
                if (action === "hide") {child.firstElementChild.style.display = "none"; }
                else {child.firstElementChild.style.display = "block"}
            }
    
        }
}

function hideRestButtons (e) {
    listItems = document.querySelectorAll(".list-item-bar")
    if (e === "all") {
        for (item of listItems) {
            changeButtons (item, "hide")
        }
    }
    else {
        let node = e.target
        while (node.className !== "row list-item-bar m-0") {
            node = node.parentElement
        }
        for (item of listItems) {
            if (item !== node) {
                changeButtons (item, "hide")
            }
        }
    }
}

function changeButtonsMeal (e, action) {
    let node = undefined
    if (e.nodeType === 1) node = e; 
    else {
        node = e.target
        while (!node.className.includes("row meal-list-item")) {
            node = node.parentElement
        }
    }
    for (child of node.childNodes)
        {
            if (child.className === 'col-sm-1 d-flex justify-content-end align-items-center p-0') { 
                if (action === "hide") child.firstElementChild.style.display = ""
                else child.firstElementChild.style.display = "block"}
            if (child.className === 'col-sm-1 d-flex justify-content-center align-items-center p-0') {
                if (action === "hide") child.firstElementChild.style.display = ""
                else child.firstElementChild.style.display = "block"}
        }
}

function hideRestButtonsMeal (e) {
    if (e === "all") {
        for (item of mealElems) {
            changeButtons (item, "hide")
        }
    }
    else {
        let node = e.target
        while (!node.className.includes("row meal-list-item")) {
            node = node.parentElement
        }
        for (item of mealElems) {
            if (item !== node) {
                changeButtons (item, "hide")
            }
        }
    }
}

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
        console.log (name, ":\n", "health match: ", healthMatch, "meal match: ", mealMatch, "genre match: ", genreMatch, "ingredient match: ", ingMatch)
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

function resetPage () {
    matchedMeals = {}
    matchedMealRow.innerHTML = ""
}

function arrayRemove (arr, value) { 
    return arr.filter(function (ele) { return ele != value })
}

function resetForm(name) {
    if (name === "edit") {
        mealEditContainer.innerHTML = curEditInnerHtml
    } else if (name === "form") mealFormContainer.innerHTML = curFormInnerHtml
}
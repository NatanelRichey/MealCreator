const mealsPage = document.querySelector('.meals-page-cont')
let mealElems = document.querySelectorAll(".meal-list-item")
const mealsMenuContainer = document.querySelector(".meals-menu-cont")
setMealBgColor()
const addMealButton = document.querySelector(".add-meal-button")
const addMealBtn = document.querySelector(".add-meal-btn")
const mealSearchButton = document.querySelector(".search-btn")
const mealPageContainer = document.querySelector(".meals-page-cont")
const mealSearchBar = document.querySelector(".meal-search-category")
const editItemButtons = document.querySelectorAll(".item-edit")
const itemEnterButtons = document.querySelectorAll(".tick-btn")
const itemTrashButtons = document.querySelectorAll(".trash-btn")
const overlay = document.querySelector(".overlay")

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
    console.log(e)
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light search-btn") {
        searchMealList(e.target)
    }

    if (e.target.nodeName === "DIV" && e.target.className === "add-meal-btn") {
        hideRestButtonsMeal("all")
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
        let categoryList = e.target.parentElement.parentElement.parentElement
        categoryList.removeChild(elemToDel)
        setMealBgColor()
        curNumber--
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light add-meal-button d-flex justify-content-begin align-items-center p-0") {
        hideRestButtonsMeal("all")
        // resetForm("form")
        location.href = "meals/new"
    }
    if (e.target.nodeName == "INPUT" && e.target.className === "meal-search-category") hideRestButtonsMeal("all") 
    if (e.target.nodeName == "SPAN" && e.target.className === "add-meal-txt") {
        // resetForm("form")
        hideRestButtonsMeal("all") 
        location.href = "meals/new"
    }
    if (e.target.nodeName == "DIV" && e.target.className === "overlay") hideRestButtonsMeal("all") 

    if (e.target.nodeName === "INPUT" && e.target.className === "meal-img") {
        curName = e.target.parentElement.nextElementSibling.firstElementChild.value
        // editMealInList(e.target)
    }
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

function searchMealList(target) {
    console.log("target: ", target)
    elemNotFound = true
    mealElems = document.querySelectorAll(".meal-list-item")
    let searchEntry = target.previousElementSibling
    let findClassName = ""
    for (let meal of mealElems) {
        if (meal.children[1].children[1].firstElementChild.value.toLowerCase().includes(searchEntry.value.toLowerCase())) {
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
        // console.log(findClassName)
        let foundElem = document.querySelector(findClassName)
        foundElem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        foundElem.setAttribute("id", "bg-color-change")
        setTimeout(() => foundElem.removeAttribute("id", "bg-color-change"), 1000)
        searchEntry.value = ""
    }
    hideRestButtonsMeal("all")
}

function changeButtonsMeal (e, action) {
    let node = undefined
    if (e.nodeType === 1) node = e; 
    else node = e.target
    // console.log("NODE...", node)
    let editBtn = node.parentElement.nextElementSibling
    let deleteBtn = node.parentElement.parentElement.nextElementSibling.firstElementChild
    // console.log("DEL BTN...", deleteBtn)
    if (action === "hide") {
        editBtn.firstElementChild.style.display = "none"; 
        deleteBtn.firstElementChild.style.display = "none"; 
    }
    else {
        editBtn.firstElementChild.style.display = "block"
        deleteBtn.firstElementChild.style.display = "block"
    }
}

function hideRestButtonsMeal (e) {
    listItems = document.querySelectorAll(".meal-item-edit")
    for (item of listItems) {
        if (e === "all") {
            changeButtonsMeal(item, "hide")
        }
        else if (item !== e.target) {
            // console.log(item)
            changeButtonsMeal(item, "hide")
        }
    }
}

function editMealInList(target) {
    // Get existing data
    curImgSrc = target["src"]
    curEditElement = target.parentElement.parentElement
    let curName = target.parentElement.nextElementSibling.firstElementChild.value
    // console.log(curName)
    document.querySelector(".meal-form-category.edit.name-field").placeholder = curName
    document.querySelector(".meal-form-category.edit.name-field").value = curName
    // console.log (document.querySelector(".meal-form-category.edit.name-field").placeholder, document.querySelector(".meal-form-category.edit.name-field").value)
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

// function resetForm(name) {
//     if (name === "edit") {
//         mealEditContainer.innerHTML = curEditInnerHtml 
//     } else if (name === "form") mealFormContainer.innerHTML = curFormInnerHtml
// }
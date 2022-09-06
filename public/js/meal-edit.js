const addIngredientButton = document.querySelector(".add-ingredient-button")
let remIngredientButton = document.querySelector(".ingredient-row")
const cancelEditButton = document.querySelector(".edit.cancel-button")
let mealEditContainer = document.querySelector(".meals-edit-cont")
const doneEditFormButton = document.querySelector(".done-button.edit.add-ingredient-button")

mealEditContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "meal-form-category ingredient-field") {
        addIngredient(e.target.parentElement.nextElementSibling.firstElementChild)
    }
})

mealEditContainer.addEventListener('click', function (e) {
    // console.log(e)
    if (e.target.nodeName === "BUTTON" && e.target.className === "btn btn-light meal-edit tag-list-check filter") e.target.classList.remove("filter")
    else if (e.target.className === "btn btn-light meal-edit tag-list-check") e.target.classList.add("filter")

    if (e.target.nodeName === "INPUT" && e.target.className === "add-ingredient-button") {
        addIngredient(e.target)
    }
    if (e.target.nodeName === "INPU" && e.target.className === "cancel-tag") e.target.parentElement.remove()

    if (e.target.nodeName === "BUTTON" && e.target.className === "cancel-button") {
        location.href = "/meals"
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "done-button edit add-ingredient-button") {
        location.href = "/meals"
    
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
        if (curName !== mealName.value) delete meals[curName.toLowerCase()]
        console.log(meals)
    }

    if (e.target.nodeName === "BUTTON" && e.target.className === "cancel-button edit") {
        location.href = "/meals"
    }
})

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
    let newForm = document.createElement("form")
    newForm.setAttribute("class", "d-block ingredient-form") 
    newForm.setAttribute("action", `/meals/edit/ingredients/${ingredientField.value}?_method=DELETE`) 
    newForm.setAttribute("method", "post") 
    let newTag = document.createElement("div")
    newTag.setAttribute("class", "tag d-flex align-items-center") 
    newTag.innerText = `${ingredientField.value}`
    newTag.innerHTML += `<input type="image" class="cancel-tag" src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/cancel.png" value="">`
    newForm.appendChild(newTag)
    ingredientRow.appendChild(newForm)
}

function editIngredient (ingredient) {
    let ingredientRow = document.querySelector(".row.d-flex.justify-content-center.edit-ingredient-row")
    let newTag = document.createElement("div")
    newTag.setAttribute("class", "tag col-md-4 d-flex align-items-center")
    newTag.innerText = `${ingredient}`
    newTag.innerHTML += `<img type="image" class="cancel-tag" src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/cancel.png">`
    ingredientRow.appendChild(newTag)
}

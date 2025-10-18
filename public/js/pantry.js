const pantryPage = document.querySelector('.pantry-page-cont')
const addPantryButtons = document.querySelectorAll(".add-pantry-button")
const pantryCategories = document.querySelectorAll(".pantry-category")
const editItemButtons = document.querySelectorAll(".item-edit")
const itemEnterButtons = document.querySelectorAll(".tick-btn")
const itemTrashButtons = document.querySelectorAll(".trash-btn")
const overlay = document.querySelector(".overlay")
const searchPantryButtons = document.querySelectorAll(".search-category")
const pantryPageContainer = document.querySelector(".pantry-page-cont")
const savedItemsSection = document.querySelector(".saved-items-section")
const savedItemsSectionList = document.querySelector(".saved-items-section.list-category")

pantryPageContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "search-category") {
        e.preventDefault()
        // Find the submit button in the same form as the input
        const form = e.target.closest('form')
        const submitButton = form.querySelector('.add-pantry-button')
        submitButton.click()
        addNewItem(submitButton)
    }

    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        e.preventDefault()
        // Find the enter button in the same form
        const form = e.target.closest('form')
        const enterButton = form.querySelector('.enter-btn, .enter-btn-saved')
        enterButton.click()
        changeButtons (e, "hide")
        e.target.blur()
    }
})

pantryPageContainer.addEventListener('click', function (e) {
    // console.log(e)
    if (e.target.nodeName === "INPUT" && e.target.className === "btn btn-light add-button add-pantry-button d-flex justify-content-center align-items-center p-0") {
        addNewItem(e.target)
    }   

    if (e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        changeButtons(e, "show")
        hideRestButtons (e)
    }

    if (e.target.nodeName === "INPUT" && e.target.className === "btn btn-light enter-btn") {
        editItemName(e.target)
    }

    if (e.target.nodeName === "INPUT" && e.target.className === "btn btn-light trash-btn") {
        // let elemToDel = e.target.parentElement.parentElement
        // let elemName = e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.value
        // let categoryList = e.target.parentElement.parentElement.parentElement
        // categoryList.removeChild(elemToDel);
        // pantry = arrayRemove(pantry, elemName.toLowerCase())
    }

    if (e.target.nodeName === "INPUT" && e.target.className === "btn btn-light tag-list-check") {
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
                                <button class="btn btn-light enter-btn"></button> 
                            </div>
                            <div class="col-sm-1 d-flex justify-content-center align-items-center p-0">
                                <button class="btn btn-light trash-btn"></button> 
                            </div>`
        savedItemsSection.appendChild(newItem)
        pantry = arrayRemove(pantry, itemName.toLowerCase())
    }

    if (e.target.nodeName === "INPUT" && e.target.className === "btn btn-light tag-list-uncheck") {
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
                                <button class="btn btn-light enter-btn"></button> 
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
    let searchField = target.previousElementSibling
    searchField.value = ""
    hideRestButtons("all")
}

function changeButtons (e, action) {
    let node = undefined
    if (e.nodeType === 1) node = e; 
    else node = e.target
    // console.log("NODE...", node)
    let editBtn = node.parentElement.nextElementSibling.firstElementChild
    let deleteBtn = node.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild
    // console.log("DEL BTN...", deleteBtn)
    if (action === "hide") {
        editBtn.style.display = "none"; 
        deleteBtn.style.display = "none"; 
    }
    else {
        editBtn.style.display = "block"
        deleteBtn.style.display = "block"
    }
}

function hideRestButtons (e) {
    listItems = document.querySelectorAll(".item-edit")
    for (item of listItems) {
        if (item !== e.target) {
            // console.log(item)
            changeButtons(item, "hide")
        }
    }
}

function arrayRemove (arr, value) { 
    return arr.filter(function (ele) { return ele != value })
}
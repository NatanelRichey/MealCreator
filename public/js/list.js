const listPage = document.querySelector('.list-page-cont')
const listCategories = document.querySelectorAll(".list-category")
const editItemButtons = document.querySelectorAll(".item-edit")
const itemEnterButtons = document.querySelectorAll(".tick-btn")
const itemTrashButtons = document.querySelectorAll(".trash-btn")
const overlay = document.querySelector(".overlay")
const savedItemsSection = document.querySelector(".saved-items-section")
const savedItemsSectionList = document.querySelector(".saved-items-section.list-category")
let listItems = document.querySelectorAll(".list-item-bar")
const listPageContainer = document.querySelector(".list-page-cont")

listPageContainer.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "search-category") {
        e.preventDefault()
        const form = e.target.closest('form')
        const submitButton = form.querySelector('input[type="submit"]')
        submitButton.click()
        addNewItem(submitButton)
    }

    if (e.key === 'Enter' && e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        e.preventDefault()
        const form = e.target.closest('form')
        const enterButton = form.querySelector('.enter-btn-list')
        enterButton.click()
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
    if (e.nodeType === 1) node = e; 
    else node = e.target
    // console.log("NODE...", node)
    let editBtn = node.parentElement.nextElementSibling.firstElementChild
    // console.log("EDIT BTN...", editBtn)
    let deleteBtn = node.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild
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
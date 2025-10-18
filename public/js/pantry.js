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
        // Trigger blur to auto-save
        e.target.blur()
    }
})

// Track if we're clicking a button to prevent hiding it
let isClickingButton = false

// Auto-save on blur (when clicking away from the field)
pantryPageContainer.addEventListener('blur', async function (e) {
    if (e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        const form = e.target.closest('form')
        const itemId = form.action.match(/\/edit\/([^?]+)/)?.[1]
        const newName = e.target.value
        const oldName = e.target.placeholder
        
        // Only update if the name actually changed
        if (newName && newName !== oldName) {
            try {
                const response = await fetch(`/pantry/edit/${itemId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ name: newName })
                })
                
                if (response.ok) {
                    // Update placeholder to reflect saved value
                    e.target.placeholder = newName
                }  else {
                    console.error('Failed to update item')
                    // Revert to old name on error
                    e.target.value = oldName
                }
            } catch (error) {
                console.error('Error updating item:', error)
                e.target.value = oldName
            }
        }
        
        // Only hide buttons if not clicking a button (like delete)
        if (!isClickingButton) {
            changeButtons(e, "hide")
        }
    }
}, true)

// Detect mousedown on delete/trash buttons to prevent hiding
pantryPageContainer.addEventListener('mousedown', function (e) {
    if (e.target.nodeName === "INPUT" && (e.target.className === "btn btn-light trash-btn" || e.target.className === "btn btn-light trash-btn-saved" || e.target.className === "btn btn-light cart-btn")) {
        isClickingButton = true
    }
})

// Reset after click completes
pantryPageContainer.addEventListener('mouseup', function (e) {
    setTimeout(() => { isClickingButton = false }, 100)
})

pantryPageContainer.addEventListener('click', function (e) {
    // console.log(e)
    if (e.target.nodeName === "INPUT" && e.target.className === "btn btn-light add-button add-pantry-button d-flex justify-content-center align-items-center p-0") {
        addNewItem(e.target)
    }   

    if (e.target.nodeName === "INPUT" && e.target.className === "item-edit") {
        isClickingButton = false  // Reset when clicking back into field
        changeButtons(e, "show")
        hideRestButtons (e)
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
    
    // Find the input field, then traverse to find delete button
    let inputField = node.classList && node.classList.contains('item-edit') ? node : node.querySelector('.item-edit')
    if (!inputField) return
    
    // Navigate from input -> parent div -> parent form -> next sibling (which should be delete form)
    let editForm = inputField.closest('form')
    if (!editForm) return
    
    let deleteForm = editForm.nextElementSibling
    
    // The delete form should be the next one after edit form (save button is hidden in edit form)
    if (!deleteForm || deleteForm.tagName !== 'FORM') return
    
    let deleteBtn = deleteForm.querySelector('.trash-btn, .trash-btn-saved')
    
    if (action === "hide") {
        if (deleteBtn) deleteBtn.style.display = "none"
    }
    else {
        if (deleteBtn) deleteBtn.style.display = "block"
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
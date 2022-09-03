// --------------------------------------------------------------- TO ADD TO DB ----------------------------------------------------------
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

// let curEditInnerHtml = mealEditContainer.innerHTML
// let curFormInnerHtml = mealFormContainer.innerHTML

// --------------------------------------------------------------- TO ADD TO DB ----------------------------------------------------------

const homeButton = document.querySelector("#home-button")
const logoButton = document.querySelector("#logo-name-button")
const pantryButton = document.querySelector("#pantry-button")
const listButton = document.querySelector("#list-button")
const mealButton = document.querySelector("#meal-button")

homeButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
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
})

pantryButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    homeButton.classList.remove('selected')
    pantryButton.classList.add('selected')
    listButton.classList.remove('selected')
    mealButton.classList.remove('selected')
})

listButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    homeButton.classList.remove('selected')
    pantryButton.classList.remove('selected')
    listButton.classList.add('selected')
    mealButton.classList.remove('selected')
})

mealButton.addEventListener('click', function () {
    choices.healthChoice = ""
    choices.mealChoice = ""
    choices.genreChoice = ""
    homeButton.classList.remove('selected')
    pantryButton.classList.remove('selected')
    listButton.classList.remove('selected')
    mealButton.classList.add('selected')
})

// document.addEventListener("keypress", (e) => {
//     let result = stopFormSubmission(e);
//     if (result) 
//     {
//         e.preventDefault();
//         console.log(e)
//     }
//   });
  
//   function stopFormSubmission(e) {
//     let hasForm = false;
//     if (e.key == "Enter") {   
//         e.composedPath().forEach((element) => {
//         let elementClass = element.getAttribute && element.getAttribute("class");
//         if (elementClass) if (elementClass.includes("form-container")) hasForm = true;
//       });
//     }
//     if (hasForm) return true;
//     else return false;
//   } 
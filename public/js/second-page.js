const secondPage = document.querySelector('.second-page-cont')
const brkButton = document.querySelector("#brk-button")
const lunchButton = document.querySelector("#lunch-button")
const dnrButton = document.querySelector("#dnr-button")
const backButtonMeal = document.querySelector("#back-button-meal")

brkButton.addEventListener('click', function () {
    choices.mealChoice = "breakfast"
    location.href = "/third-page"
})

lunchButton.addEventListener('click', function () {
    choices.mealChoice = "lunch"
    location.href = "/third-page"
})

dnrButton.addEventListener('click', function () {
    choices.mealChoice = "dinner"
    location.href = "/third-page"
})

backButtonMeal.addEventListener('click', function () { 
    choices.healthChoice = ""
    location.href = "/"
})
const brkButton = document.querySelector(".breakfast")
const lunchButton = document.querySelector(".lunch")
const dnrButton = document.querySelector(".dinner")

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
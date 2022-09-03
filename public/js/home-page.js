const homePage = document.querySelector('.home-page-cont')
const healthyButton = document.querySelector("#healthy-button")
const regularButton = document.querySelector("#regular-button")

healthyButton.addEventListener('click', function () {
    location.href = "/second-page"
    choices.healthChoice = "healthy"
})

regularButton.addEventListener('click', function () {
    location.href = "/second-page"
    choices.healthChoice = "regular"
})

function resetPage () {
    matchedMeals = {}
    matchedMealRow.innerHTML = ""
}
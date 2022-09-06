const healthyButton = document.querySelector(".healthy")
const regularButton = document.querySelector(".regular")

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
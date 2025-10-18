const optionCards = document.querySelectorAll('.option-card');
const surpriseBtn = document.getElementById('surprise-btn');
const form = document.getElementById('meal-selector-form');

// Track selections
const selections = {
    health: null,
    mealtime: null,
    genre: null
};

// Handle Surprise Me button
if (surpriseBtn) {
    surpriseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/app/choice/suprise';
    });
}

// Handle option card clicks
optionCards.forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        const value = this.dataset.value;
        
        // Remove selection from other cards in same category
        document.querySelectorAll(`[data-category="${category}"]`).forEach(c => {
            c.classList.remove('selected');
        });
        
        // Add selection to clicked card
        this.classList.add('selected');
        
        // Update selections object
        selections[category] = value;
        
        // Update hidden form inputs
        document.getElementById(`${category}-input`).value = value;
        
        // Auto-submit if all categories are selected
        if (selections.health && selections.mealtime && selections.genre) {
            form.submit();
        }
    });
});


const optionCards = document.querySelectorAll('.option-card');
const submitBtn = document.getElementById('submit-btn');
const surpriseBtn = document.getElementById('surprise-btn');
const errorMessage = document.getElementById('error-message');
const form = document.getElementById('meal-selector-form');

// Track selections
const selections = {
    health: null,
    mealtime: null,
    genre: null
};

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
        
        // Check if all categories are selected
        validateSelections();
    });
});

// Validate that all categories have a selection
function validateSelections() {
    const allSelected = selections.health && selections.mealtime && selections.genre;
    
    if (allSelected) {
        submitBtn.disabled = false;
        errorMessage.style.display = 'none';
    } else {
        submitBtn.disabled = true;
    }
    
    return allSelected;
}

// Handle form submission
form.addEventListener('submit', function(e) {
    if (!validateSelections()) {
        e.preventDefault();
        errorMessage.style.display = 'block';
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Handle surprise me button
surpriseBtn.addEventListener('click', function() {
    window.location.href = '/app/choice/suprise';
});


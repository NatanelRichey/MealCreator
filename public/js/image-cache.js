// Image caching and preloading for better performance
const imageCache = new Map();

function preloadImage(src) {
    if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = () => {
            // Fallback to default image on error
            const fallbackSrc = 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg';
            if (src !== fallbackSrc) {
                preloadImage(fallbackSrc).then(resolve).catch(reject);
            } else {
                reject(new Error('Failed to load image'));
            }
        };
        img.src = src;
    });
}

// Preload images when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only target meal images, not page images
    const mealImages = document.querySelectorAll('.meal-img, .selection-images, #matched-meal-image');
    mealImages.forEach(img => {
        if (img.src) {
            preloadImage(img.src).catch(console.warn);
        }
    });
});

// Add loading states to images
function addLoadingStates() {
    // Only target meal images, not page images
    const mealImages = document.querySelectorAll('.meal-img, .selection-images, #matched-meal-image');
    mealImages.forEach(img => {
        // Only apply loading state if image hasn't loaded yet
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
        
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        img.onerror = function() {
            this.src = 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg';
            this.style.opacity = '1';
        };
        
        // If image is already loaded (from cache), ensure it's visible
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
        }
    });
}

// Initialize loading states when DOM is ready
document.addEventListener('DOMContentLoaded', addLoadingStates);

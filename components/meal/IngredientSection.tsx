'use client';

interface IngredientSectionProps {
  ingredients: string[];
  currentIngredient: string;
  onCurrentIngredientChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
}

export function IngredientSection({ 
  ingredients, 
  currentIngredient, 
  onCurrentIngredientChange, 
  onAddIngredient, 
  onRemoveIngredient 
}: IngredientSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddIngredient();
    }
  };

  return (
    <div className="w-full -mt-2 sm:-mt-4 lg:-mt-10 relative z-20">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-athiti text-gray-800 mb-2 sm:mb-3 lg:mb-4 text-center">Ingredients</h3>
      
      {/* Add Ingredient Input */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 w-full relative z-10">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => onCurrentIngredientChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter an ingredient..."
          className="w-full max-w-[350px] h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg text-base sm:text-lg md:text-xl font-athiti focus:border-meal-green-light focus:outline-none transition-colors relative z-10"
        />
        <button
          type="button"
          onClick={onAddIngredient}
          className="w-auto sm:w-[170px] h-10 sm:h-12 px-4 bg-meal-green-light text-black text-base sm:text-lg md:text-xl font-athiti rounded-lg hover:bg-meal-green-hover transition-colors whitespace-nowrap"
        >
          <span className="hidden sm:inline">Add Ingredient</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Ingredient Tags - Responsive height with scrolling */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 w-full h-[50px] sm:h-[60px] md:h-[80px] overflow-y-auto">
          {ingredients.map((ingredient, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-meal-green-light border-2 border-meal-green-light px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-athiti h-fit"
            >
              <span className="text-black truncate max-w-[100px] sm:max-w-[120px]">{ingredient}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveIngredient(index);
                }}
                className="text-red-600 hover:text-red-800 font-athiti text-lg leading-none flex-shrink-0"
                aria-label="Remove ingredient"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

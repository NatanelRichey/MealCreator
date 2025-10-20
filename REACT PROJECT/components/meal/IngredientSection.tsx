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
    <div className="w-full -mt-10 relative z-20">
      <h3 className="text-2xl font-athiti text-gray-800 mb-4 text-center">Ingredients</h3>
      
      {/* Add Ingredient Input */}
      <div className="flex items-center justify-center gap-3 mb-4 w-full relative z-10">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => onCurrentIngredientChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter an ingredient..."
          className="w-[350px] h-12 px-4 bg-white border-2 border-gray-300 rounded-lg text-xl font-athiti focus:border-meal-green-light focus:outline-none transition-colors relative z-10"
        />
        <button
          type="button"
          onClick={onAddIngredient}
          className="w-[170px] h-12 bg-meal-green-light text-black text-xl font-athiti rounded-lg hover:bg-meal-green-hover transition-colors"
        >
          Add Ingredient
        </button>
      </div>

      {/* Ingredient Tags - Fixed height with scrolling */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 w-full h-[80px] overflow-y-auto">
          {ingredients.map((ingredient, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-meal-green-light border-2 border-meal-green-light px-3 py-1 rounded-full text-sm font-athiti h-fit"
            >
              <span className="text-black truncate max-w-[120px]">{ingredient}</span>
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

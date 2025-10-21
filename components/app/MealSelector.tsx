'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldImage } from 'next-cloudinary';

interface MealOption {
  category: 'health' | 'mealtime' | 'genre';
  value: string;
  label: string;
  publicId: string;  // Changed from full URL to Cloudinary public ID
}

const MEAL_OPTIONS: MealOption[] = [
  // Health options
  { category: 'health', value: 'healthy', label: 'Healthy', publicId: 'page-images/healthy' },
  { category: 'health', value: 'regular', label: 'Regular', publicId: 'page-images/regular' },
  
  // Meal time options
  { category: 'mealtime', value: 'breakfast', label: 'Breakfast', publicId: 'page-images/breakfast' },
  { category: 'mealtime', value: 'lunch', label: 'Lunch', publicId: 'page-images/lunch' },
  { category: 'mealtime', value: 'dinner', label: 'Dinner', publicId: 'page-images/dinner' },
  
  // Genre options
  { category: 'genre', value: 'dairy', label: 'Dairy', publicId: 'page-images/dairy' },
  { category: 'genre', value: 'parve', label: 'Parve', publicId: 'page-images/parve' },
  { category: 'genre', value: 'meaty', label: 'Meaty', publicId: 'page-images/meaty' },
];

interface Selections {
  health: string | null;
  mealtime: string | null;
  genre: string | null;
}

export function MealSelector() {
  const router = useRouter();
  const [selections, setSelections] = useState<Selections>({
    health: null,
    mealtime: null,
    genre: null,
  });

  const handleSurpriseMe = () => {
    router.push('/find-meal/surprise');
  };

  const handleCardClick = (option: MealOption) => {
    const newSelections = {
      ...selections,
      [option.category]: option.value,
    };
    
    setSelections(newSelections);

    // Auto-submit if all categories are selected
    if (newSelections.health && newSelections.mealtime && newSelections.genre) {
      // Navigate to filtered meals page
      router.push(`/find-meal/results?health=${newSelections.health}&mealtime=${newSelections.mealtime}&genre=${newSelections.genre}`);
    }
  };

  const isSelected = (option: MealOption) => {
    return selections[option.category] === option.value;
  };

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 flex items-center justify-center overflow-hidden" style={{ padding: '1cm' }}>
      <div className="flex flex-col justify-center items-center max-w-[600px] w-full">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-athiti text-center text-gray-800 mb-2">
          Find Your Perfect Meal
        </h1>
        <p className="text-xs md:text-sm font-athiti text-center text-gray-600 mb-4">
          Select one option from each category
        </p>

        {/* Options Grid - perfectly centered */}
        <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 w-full max-w-[450px] mx-auto">
          {/* Surprise Me Button */}
          <button
            onClick={handleSurpriseMe}
            className="
              relative aspect-square overflow-hidden rounded-lg cursor-pointer
              transition-all duration-300 border-[3px] border-gray-400 bg-gray-400
              flex items-center justify-center
              hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(128,128,128,0.5)] hover:bg-gray-500
              col-start-1 row-start-1
            "
          >
            <span className="text-white text-sm md:text-base font-athiti text-center p-2">
              Surprise Me!
            </span>
          </button>

          {/* Meal Option Cards */}
          {MEAL_OPTIONS.map((option, index) => {
            const selected = isSelected(option);
            
            return (
              <button
                key={`${option.category}-${option.value}`}
                onClick={() => handleCardClick(option)}
                className={`
                  relative aspect-square overflow-hidden rounded-lg cursor-pointer
                  transition-all duration-300 border-[3px]
                  ${selected 
                    ? 'border-[#28a745] shadow-[0_0_20px_rgba(40,167,69,0.5)]' 
                    : 'border-transparent'
                  }
                  hover:-translate-y-1
                `}
              >
                <CldImage
                  src={option.publicId}
                  alt={option.label}
                  width={300}
                  height={300}
                  crop="fill"
                  gravity="auto"
                  quality="auto"
                  format="auto"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-3 md:pt-4">
                  <span className="text-white text-xs md:text-sm font-athiti text-center block">
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


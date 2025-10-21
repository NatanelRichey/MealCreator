'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PANTRY_CATEGORIES, getCategoryDisplayName } from '@/lib/data';

interface CategoryFilterProps {
  onFilterChange: (categories: string[]) => void;
  currentFilters: string[];
}

/**
 * CategoryFilter Component
 * 
 * Displays clickable category buttons with icons to filter items
 * - Shows all categories from PANTRY_CATEGORIES
 * - Supports multiple category selection
 * - Click to add/remove from filter, click All to clear all
 */
export function CategoryFilter({ onFilterChange, currentFilters }: CategoryFilterProps) {
  const toggleCategory = (category: string, event?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    if (currentFilters.includes(category)) {
      // Remove category from filters
      onFilterChange(currentFilters.filter(c => c !== category));
    } else {
      // Add category to filters
      onFilterChange([...currentFilters, category]);
    }
    // Remove focus from button to prevent stuck hover state on mobile
    if (event && 'currentTarget' in event) {
      event.currentTarget.blur();
    }
  };

  const clearAll = (event?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    onFilterChange([]);
    // Remove focus from button to prevent stuck hover state on mobile
    if (event && 'currentTarget' in event) {
      event.currentTarget.blur();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-3 md:p-4">
      <div className="flex items-center justify-center gap-2 md:gap-2 flex-wrap">
        {/* All Items Button */}
        <button
          onClick={clearAll}
          onTouchStart={(e) => e.preventDefault()}
          style={{ WebkitTapHighlightColor: 'transparent' }}
          className={`
            flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg
            font-athiti text-base md:transition-all md:duration-200 focus:outline-none touch-manipulation
            ${currentFilters.length === 0
              ? 'bg-meal-green-light border-2 border-meal-green shadow-md'
              : 'bg-white border-2 border-gray-200 md:hover:border-meal-green-light md:hover:bg-meal-green-light/30'
            }
          `}
        >
          <span className="text-2xl">🏠</span>
          <span className="hidden md:inline text-gray-800 font-medium">All Items</span>
        </button>

        {/* Category Buttons */}
        {PANTRY_CATEGORIES.filter(cat => cat !== 'Saved Items').map((category) => {
          const isSelected = currentFilters.includes(category);
          
          return (
            <button
              key={category}
              onClick={(e) => toggleCategory(category, e)}
              onTouchStart={(e) => e.preventDefault()}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className={`
                flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg
                font-athiti text-base md:transition-all md:duration-200 focus:outline-none touch-manipulation
                ${isSelected
                  ? 'bg-meal-green-light border-2 border-meal-green shadow-md md:scale-105'
                  : 'bg-white border-2 border-gray-200 md:hover:border-meal-green-light md:hover:bg-meal-green-light/30'
                }
              `}
            >
              <Image
                src={`https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/${category.toLowerCase()}.png`}
                alt={getCategoryDisplayName(category)}
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <span className="hidden md:inline text-gray-800 font-medium">
                {getCategoryDisplayName(category)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Filters Indicator */}
      {currentFilters.length > 0 && (
        <div className="mt-3 text-center">
          <p className="text-sm font-athiti text-gray-600">
            Showing: <span className="font-bold text-meal-green">
              {currentFilters.map(getCategoryDisplayName).join(', ')}
            </span>
            {' • '}
            <button
              onClick={clearAll}
              className="text-meal-green hover:text-meal-green-dark underline"
            >
              Clear all
            </button>
          </p>
        </div>
      )}
    </div>
  );
}


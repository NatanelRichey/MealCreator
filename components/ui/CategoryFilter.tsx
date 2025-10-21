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
  const toggleCategory = (category: string) => {
    if (currentFilters.includes(category)) {
      // Remove category from filters
      onFilterChange(currentFilters.filter(c => c !== category));
    } else {
      // Add category to filters
      onFilterChange([...currentFilters, category]);
    }
  };

  const clearAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* All Items Button */}
        <button
          onClick={clearAll}
          className={`
            flex items-center gap-2 px-3 py-2 md:px-4 rounded-lg
            font-athiti text-base transition-all duration-200
            ${currentFilters.length === 0
              ? 'bg-meal-green-light border-2 border-meal-green shadow-md'
              : 'bg-white border-2 border-gray-200 hover:border-meal-green-light hover:bg-meal-green-light/30'
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
              key={`${category}-${isSelected}`}
              onClick={() => toggleCategory(category)}
              className={`
                flex items-center gap-2 px-3 py-2 md:px-4 rounded-lg
                font-athiti text-base transition-all duration-200
                ${isSelected
                  ? 'bg-meal-green-light border-2 border-meal-green shadow-md scale-105'
                  : 'bg-white border-2 border-gray-200 hover:border-meal-green-light hover:bg-meal-green-light/30'
                }
              `}
            >
              <Image
                src={`https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/${category.toLowerCase()}.png`}
                alt={getCategoryDisplayName(category)}
                width={24}
                height={24}
                className="w-6 h-6"
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


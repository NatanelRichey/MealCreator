'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PANTRY_CATEGORIES, getCategoryDisplayName } from '@/lib/data';

interface CategoryFilterProps {
  onFilterChange: (category: string | null) => void;
  currentFilter: string | null;
}

/**
 * CategoryFilter Component
 * 
 * Displays clickable category buttons with icons to filter items
 * - Shows all categories from PANTRY_CATEGORIES
 * - Highlights selected category
 * - Click to filter, click again to show all
 */
export function CategoryFilter({ onFilterChange, currentFilter }: CategoryFilterProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4 mb-6">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* All Items Button */}
        <button
          onClick={() => onFilterChange(null)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            font-athiti text-base transition-all duration-200
            ${currentFilter === null
              ? 'bg-meal-green-light border-2 border-meal-green shadow-md'
              : 'bg-white border-2 border-gray-200 hover:border-meal-green-light hover:bg-meal-green-light/30'
            }
          `}
        >
          <span className="text-2xl">🏠</span>
          <span className="text-gray-800 font-medium">All Items</span>
        </button>

        {/* Category Buttons */}
        {PANTRY_CATEGORIES.filter(cat => cat !== 'Saved Items').map((category) => (
          <button
            key={category}
            onClick={() => onFilterChange(currentFilter === category ? null : category)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              font-athiti text-base transition-all duration-200
              ${currentFilter === category
                ? 'bg-meal-green-light border-2 border-meal-green shadow-md scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-meal-green-light hover:bg-meal-green-light/30'
              }
            `}
          >
            <Image
              src={`https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/${category.toLowerCase()}.png`}
              alt={category}
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-gray-800 font-medium">
              {getCategoryDisplayName(category)}
            </span>
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      {currentFilter && (
        <div className="mt-3 text-center">
          <p className="text-sm font-athiti text-gray-600">
            Showing: <span className="font-bold text-meal-green">{getCategoryDisplayName(currentFilter)}</span>
            {' • '}
            <button
              onClick={() => onFilterChange(null)}
              className="text-meal-green hover:text-meal-green-dark underline"
            >
              Clear filter
            </button>
          </p>
        </div>
      )}
    </div>
  );
}


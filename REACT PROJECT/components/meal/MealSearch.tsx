'use client';

import { useState, useRef } from 'react';
import type { Meal as MealType } from '@/lib/types';

// local relaxed type removed; using shared Meal type

interface MealSearchProps {
  meals: MealType[];
  onMealSelect?: (meal: MealType) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export function MealSearch({ meals, onMealSelect, scrollContainerRef }: MealSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    console.log('Searching for:', searchTerm);
    console.log('Available meals:', meals.map(m => m.name || m.mealName));

    // Find matching meal (partial match, case insensitive)
    const foundMeal = meals.find(meal => {
      const mealName = meal.name || meal.mealName || '';
      return mealName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    console.log('Found meal:', foundMeal);

    if (foundMeal) {
      // Scroll to the meal
      const mealId = foundMeal.id || foundMeal._id;
      console.log('Looking for element with data-meal-id:', mealId);
      
      const mealElement = document.querySelector(`[data-meal-id="${mealId}"]`);
      console.log('Found element:', mealElement);
      
      if (mealElement) {
        // Determine the container to evaluate visibility against
        const container = scrollContainerRef?.current || window;

        // Calculate visibility relative to the scroll container
        const elemRect = mealElement.getBoundingClientRect();
        const contRect = scrollContainerRef?.current
          ? scrollContainerRef.current.getBoundingClientRect()
          : { top: 0, bottom: window.innerHeight } as DOMRect | any;

        const fullyVisible = elemRect.top >= contRect.top && elemRect.bottom <= contRect.bottom;
        const partiallyVisible = elemRect.bottom > contRect.top && elemRect.top < contRect.bottom;

        console.log('Fully visible:', fullyVisible, 'Partially visible:', partiallyVisible);

        // If not fully visible, scroll so that the card's top aligns with the container's top
        if (!fullyVisible) {
          if (scrollContainerRef?.current) {
            const containerEl = scrollContainerRef.current;
            const targetTop = elemRect.top - contRect.top + containerEl.scrollTop; // absolute position within container
            containerEl.scrollTo({ top: Math.max(targetTop - 8, 0), behavior: 'smooth' });
          } else {
            mealElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }
        }
        
        // Highlight the meal
        console.log('Adding highlight class...');
        mealElement.classList.add('meal-highlight');
        setTimeout(() => {
          console.log('Removing highlight class...');
          mealElement.classList.remove('meal-highlight');
        }, 1000);
      } else {
        console.log('Element not found! Available elements:');
        const allElements = document.querySelectorAll('[data-meal-id]');
        allElements.forEach(el => console.log('Element:', el.getAttribute('data-meal-id')));
      }

      // Call onMealSelect if provided
      if (onMealSelect) {
        onMealSelect(foundMeal);
      }
    } else {
      // Show "Not Found" message
      setNotFound(true);
      setTimeout(() => {
        setNotFound(false);
        if (searchInputRef.current) {
          searchInputRef.current.placeholder = 'Enter a Meal';
        }
      }, 1000);
    }

    // Clear search and reset
    setSearchTerm('');
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="relative flex-1 max-w-[500px] min-w-[280px]">
        <input
          ref={searchInputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={notFound ? "Not Found!" : "Enter a Meal"}
          className={`
            w-full h-10 px-3 py-2 border border-gray-300 rounded-lg
            font-athiti text-lg
            focus:outline-none focus:ring-2 focus:ring-meal-green focus:border-transparent
            transition-all duration-200
            ${notFound ? 'border-red-400 bg-red-50' : ''}
          `}
        />
      </div>
      
      <button
        onClick={handleSearch}
        disabled={isSearching || !searchTerm.trim()}
        className="
          w-8 h-8 bg-meal-green-light text-black rounded-lg
          flex items-center justify-center
          hover:bg-meal-green-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        "
        aria-label="Search meals"
      >
        {isSearching ? (
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// CSS for highlighting (add to your global CSS or component styles)
const highlightStyles = `
  .meal-highlight {
    background-color: #fbf8f8 !important;
    transition: background-color 1s ease-in;
  }
`;

export default highlightStyles;

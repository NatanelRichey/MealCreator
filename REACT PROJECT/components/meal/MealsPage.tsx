'use client';

import { useRef, useState, useEffect } from 'react';
import { MealSearch } from './MealSearch';
import { MealCard } from './MealCard';
import type { Meal as MealType } from '@/lib/types';
import { getMeals, deleteMeal } from '@/lib/api';
import { FlashMessage } from '@/components/ui/FlashMessage';

interface MealsPageProps {
  onMealEdit?: (meal: MealType) => void;
  onAddMeal?: () => void;
}

interface FlashMsg {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function MealsPage({ 
  onMealEdit, 
  onAddMeal 
}: MealsPageProps) {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [flashMessages, setFlashMessages] = useState<FlashMsg[]>([]);

  // Fetch meals from backend when component mounts
  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMeals();
      console.log('Meals data received:', data);
      setMeals(data || []);
    } catch (err) {
      console.error('Failed to load meals:', err);
      setError('Failed to load meals. Please try again.');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showFlash = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setFlashMessages(prev => [...prev, { id, type, message }]);
  };

  const dismissFlash = (id: string) => {
    setFlashMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleMealDelete = async (meal: MealType) => {
    if (!meal._id) return;
    
    try {
      await deleteMeal(meal._id);
      // Remove meal from local state
      setMeals(meals.filter(m => m._id !== meal._id));
      showFlash('success', `"${meal.mealName}" deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete meal:', err);
      showFlash('error', 'Failed to delete meal. Please try again.');
    }
  };

  const handleMealSelect = (meal: MealType) => {
    setSelectedMeal(meal);
    console.log('Selected meal:', meal.mealName);
  };

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-meals bg-cover bg-center flex flex-col overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/85 pointer-events-none"></div>
      
      {/* Flash Messages */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        {flashMessages.map((msg) => (
          <FlashMessage
            key={msg.id}
            type={msg.type}
            message={msg.message}
            onClose={() => dismissFlash(msg.id)}
          />
        ))}
      </div>
      
      {/* Fixed Header */}
      <div className="relative z-10 p-8 pb-4 flex-shrink-0 pointer-events-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-athiti text-gray-800">My Meals</h1>
            <button
              onClick={onAddMeal}
              className="
                bg-meal-green-light text-black px-6 py-2 rounded-lg
                font-athiti text-lg hover:bg-meal-green-hover
                transition-colors duration-200
              "
            >
              Add Meal
            </button>
          </div>

          {/* Search Bar */}
          <MealSearch 
            meals={meals} 
            onMealSelect={handleMealSelect}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto pointer-events-auto">
        <div className="max-w-6xl mx-auto px-8 pb-8">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-meal-green-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-athiti">Loading meals...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-athiti text-red-600 mb-2">
                {error}
              </h3>
              <button
                onClick={loadMeals}
                className="
                  bg-meal-green-light text-black px-6 py-3 rounded-lg
                  font-athiti text-lg hover:bg-meal-green-hover
                  transition-colors duration-200
                "
              >
                Try Again
              </button>
            </div>
          )}

          {/* Meals Grid */}
          {!isLoading && !error && meals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {meals.map((meal: MealType) => {
                const mealId = meal._id || 'unknown';
                return (
                  <div
                    key={mealId}
                    data-meal-id={mealId}
                    className="meal-card-container"
                  >
                    <MealCard 
                      meal={meal}
                      index={meals.indexOf(meal)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && meals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-athiti text-gray-600 mb-2">
                No meals yet
              </h3>
              <p className="text-gray-500 font-athiti mb-4">
                Start by adding your first meal!
              </p>
              <button
                onClick={onAddMeal}
                className="
                  bg-meal-green-light text-black px-6 py-3 rounded-lg
                  font-athiti text-lg hover:bg-meal-green-hover
                  transition-colors duration-200
                "
              >
                Add Your First Meal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add highlight styles */}
      <style jsx global>{`
        .meal-highlight {
          border: 3px solid #d1d5db !important;
          transition: all 0.1s ease-in-out !important;
          animation: clear-flash 1s ease-in-out !important;
        }
        
        .meal-highlight img {
          opacity: 0.8 !important;
          transition: opacity 0.1s ease-in-out !important;
        }
        
        @keyframes clear-flash {
          0% {
            border-color: #d1d5db;
            box-shadow: 0 0 5px rgba(209, 213, 219, 0.5);
          }
          20% {
            border-color: #9ca3af;
            box-shadow: 0 0 15px rgba(156, 163, 175, 0.8);
          }
          40% {
            border-color: #d1d5db;
            box-shadow: 0 0 5px rgba(209, 213, 219, 0.5);
          }
          60% {
            border-color: #9ca3af;
            box-shadow: 0 0 15px rgba(156, 163, 175, 0.8);
          }
          80% {
            border-color: #d1d5db;
            box-shadow: 0 0 5px rgba(209, 213, 219, 0.5);
          }
          100% {
            border-color: #d1d5db;
            box-shadow: 0 0 5px rgba(209, 213, 219, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

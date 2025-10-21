'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findMeals } from '@/lib/api';
import { MealCard } from '@/components/meal/MealCard';
import type { Meal } from '@/lib/types';

export default function FilteredMealsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const health = searchParams.get('health');
    const mealtime = searchParams.get('mealtime');
    const genre = searchParams.get('genre');

    if (health && mealtime && genre) {
      loadFilteredMeals(health, mealtime, genre);
    }
  }, [searchParams]);

  const loadFilteredMeals = async (health: string, mealtime: string, genre: string) => {
    try {
      setIsLoading(true);
      const data = await findMeals({ health, mealtime, genre });
      setMeals(data);
    } catch (error) {
      console.error('Failed to load filtered meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-meals bg-cover bg-center overflow-y-auto">
      <div className="absolute inset-0 bg-white/85 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto p-8 pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-athiti text-gray-800">Matched Meals</h1>
          <button
            onClick={() => router.push('/find-meal')}
            className="bg-meal-green-light text-black px-6 py-2 rounded-lg font-athiti hover:bg-meal-green-hover"
          >
            Back to Selector
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-meal-green-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-athiti">Finding your perfect meal...</p>
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal, index) => (
              <MealCard key={meal._id} meal={meal} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-athiti text-gray-600 mb-2">
              No matching meals found
            </h3>
            <p className="text-gray-500 font-athiti mb-4">
              Try different preferences or make sure you have the ingredients in your pantry
            </p>
            <button
              onClick={() => router.push('/find-meal')}
              className="bg-meal-green-light text-black px-6 py-3 rounded-lg font-athiti hover:bg-meal-green-hover"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSurpriseMeals } from '@/lib/api';
import { MealCard } from '@/components/meal/MealCard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Meal } from '@/lib/types';

export default function SurpriseMealsPage() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSurpriseMeals();
  }, []);

  const loadSurpriseMeals = async () => {
    try {
      setIsLoading(true);
      const data = await getSurpriseMeals();
      setMeals(data);
    } catch (error) {
      console.error('Failed to load surprise meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="fixed top-16 bottom-0 left-0 right-0 bg-meals bg-cover bg-center overflow-y-auto">
        <div className="absolute inset-0 bg-white/85 pointer-events-none"></div>
        
        <div className="relative z-10 container mx-auto p-8 pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-athiti text-gray-800">Surprise! 🎉</h1>
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
            <p className="text-gray-600 font-athiti">Finding meals you can make...</p>
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal, index) => (
              <MealCard key={meal._id} meal={meal} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-athiti text-gray-600 mb-2">
              No meals you can make right now
            </h3>
            <p className="text-gray-500 font-athiti mb-4">
              Make sure you have ingredients in your pantry or add more meals
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
    </ProtectedRoute>
  );
}


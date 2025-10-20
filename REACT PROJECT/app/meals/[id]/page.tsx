'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMeal, deleteMeal } from '@/lib/api';
import { MealForm } from '@/components/meal/MealForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Meal } from '@/lib/types';

export default function EditMealPage() {
  const params = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadMeal(params.id as string);
    }
  }, [params.id]);

  const loadMeal = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await getMeal(id);
      setMeal(data);
    } catch (error) {
      console.error('Failed to load meal:', error);
      router.push('/meals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/meals');
  };

  const handleCancel = () => {
    router.push('/meals');
  };

  const handleDelete = async () => {
    if (!meal?._id) return;
    
    try {
      await deleteMeal(meal._id);
      router.push('/meals');
    } catch (error) {
      console.error('Failed to delete meal:', error);
      alert('Failed to delete meal. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-meal-green-light border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!meal) {
    return null;
  }

  return (
    <ProtectedRoute>
      <MealForm
        meal={meal}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </ProtectedRoute>
  );
}


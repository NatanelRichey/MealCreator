// Custom hooks for meals with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  type Meal,
  type CreateMealData,
} from '@/lib/api';

// Query keys
export const MEALS_QUERY_KEY = ['meals'];

/**
 * Hook to fetch all meals with caching
 */
export function useMeals() {
  return useQuery({
    queryKey: MEALS_QUERY_KEY,
    queryFn: getMeals,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes (mobile-friendly)
    gcTime: 1000 * 60 * 30, // Keep in memory for 30 minutes
  });
}

/**
 * Hook to create a new meal with optimistic update
 */
export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mealData: CreateMealData) => createMeal(mealData),
    onMutate: async (newMeal) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: MEALS_QUERY_KEY });

      // Snapshot the previous value
      const previousMeals = queryClient.getQueryData<Meal[]>(MEALS_QUERY_KEY);

      // Optimistically update to the new value
      if (previousMeals) {
        const optimisticMeal: Meal = {
          ...newMeal,
          _id: `temp-${Date.now()}`,
          owner: '',
          confirmed: false,
          createdAt: new Date(),
        };
        queryClient.setQueryData<Meal[]>(MEALS_QUERY_KEY, [...previousMeals, optimisticMeal]);
      }

      // Return context with previous meals for rollback
      return { previousMeals };
    },
    onError: (_err, _newMeal, context) => {
      // Rollback on error
      if (context?.previousMeals) {
        queryClient.setQueryData(MEALS_QUERY_KEY, context.previousMeals);
      }
    },
    onSettled: () => {
      // Refetch to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: MEALS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update a meal with optimistic update
 */
export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mealId, mealData }: { mealId: string; mealData: Partial<CreateMealData> }) =>
      updateMeal(mealId, mealData),
    onMutate: async ({ mealId, mealData }) => {
      await queryClient.cancelQueries({ queryKey: MEALS_QUERY_KEY });

      const previousMeals = queryClient.getQueryData<Meal[]>(MEALS_QUERY_KEY);

      if (previousMeals) {
        queryClient.setQueryData<Meal[]>(
          MEALS_QUERY_KEY,
          previousMeals.map((meal) =>
            meal._id === mealId ? { ...meal, ...mealData } : meal
          )
        );
      }

      return { previousMeals };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMeals) {
        queryClient.setQueryData(MEALS_QUERY_KEY, context.previousMeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEALS_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a meal with optimistic update
 */
export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mealId: string) => deleteMeal(mealId),
    onMutate: async (mealId) => {
      await queryClient.cancelQueries({ queryKey: MEALS_QUERY_KEY });

      const previousMeals = queryClient.getQueryData<Meal[]>(MEALS_QUERY_KEY);

      // Optimistically remove the meal from the list
      if (previousMeals) {
        queryClient.setQueryData<Meal[]>(
          MEALS_QUERY_KEY,
          previousMeals.filter((meal) => meal._id !== mealId)
        );
      }

      return { previousMeals };
    },
    onError: (_err, _mealId, context) => {
      // Rollback on error
      if (context?.previousMeals) {
        queryClient.setQueryData(MEALS_QUERY_KEY, context.previousMeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEALS_QUERY_KEY });
    },
  });
}


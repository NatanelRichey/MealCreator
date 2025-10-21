// Custom hooks for shopping list with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getShoppingList,
  addShoppingListItem,
  editShoppingListItem,
  deleteShoppingListItem,
  moveToPantry,
  type ShoppingListData,
  type ShoppingListItem,
} from '@/lib/api';

// Query keys
export const SHOPPING_LIST_QUERY_KEY = ['shoppingList'];
export const PANTRY_QUERY_KEY = ['pantry'];

/**
 * Hook to fetch shopping list with caching
 */
export function useShoppingList() {
  return useQuery({
    queryKey: SHOPPING_LIST_QUERY_KEY,
    queryFn: getShoppingList,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });
}

/**
 * Hook to add shopping list item with optimistic update
 */
export function useAddShoppingListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ category, itemName }: { category: string; itemName: string }) =>
      addShoppingListItem(category, itemName),
    onMutate: async ({ category, itemName }) => {
      await queryClient.cancelQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });

      const previousList = queryClient.getQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY);

      if (previousList) {
        const newItem: ShoppingListItem = {
          _id: `temp-${Date.now()}`,
          name: itemName,
          category,
          owner: '',
          createdAt: new Date(),
        };

        const updatedCategories = { ...previousList.categories };
        if (!updatedCategories[category]) {
          updatedCategories[category] = [];
        }
        updatedCategories[category] = [...updatedCategories[category], newItem];

        queryClient.setQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY, {
          categories: updatedCategories,
        });
      }

      return { previousList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(SHOPPING_LIST_QUERY_KEY, context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });
    },
  });
}

/**
 * Hook to edit shopping list item with optimistic update
 */
export function useEditShoppingListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, newName }: { itemId: string; newName: string }) =>
      editShoppingListItem(itemId, newName),
    onMutate: async ({ itemId, newName }) => {
      await queryClient.cancelQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });

      const previousList = queryClient.getQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY);

      if (previousList) {
        const updatedCategories = { ...previousList.categories };
        
        Object.keys(updatedCategories).forEach((category) => {
          updatedCategories[category] = updatedCategories[category].map((item) =>
            item._id === itemId ? { ...item, name: newName } : item
          );
        });

        queryClient.setQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY, {
          categories: updatedCategories,
        });
      }

      return { previousList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(SHOPPING_LIST_QUERY_KEY, context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete shopping list item with optimistic update
 */
export function useDeleteShoppingListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteShoppingListItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });

      const previousList = queryClient.getQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY);

      if (previousList) {
        const updatedCategories = { ...previousList.categories };
        
        Object.keys(updatedCategories).forEach((category) => {
          updatedCategories[category] = updatedCategories[category].filter(
            (item) => item._id !== itemId
          );
        });

        queryClient.setQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY, {
          categories: updatedCategories,
        });
      }

      return { previousList };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(SHOPPING_LIST_QUERY_KEY, context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });
    },
  });
}

/**
 * Hook to move item to pantry with optimistic update
 */
export function useMoveToPantry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemName: string) => moveToPantry(itemName),
    onMutate: async (itemName) => {
      await queryClient.cancelQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });

      const previousList = queryClient.getQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY);
      const previousPantry = queryClient.getQueryData(PANTRY_QUERY_KEY);

      let movedItem: ShoppingListItem | null = null;

      if (previousList) {
        const updatedCategories = { ...previousList.categories };
        
        // Find and remove from shopping list
        Object.keys(updatedCategories).forEach((category) => {
          const item = updatedCategories[category].find((i) => i.name === itemName);
          if (item) {
            movedItem = item;
          }
          updatedCategories[category] = updatedCategories[category].filter(
            (item) => item.name !== itemName
          );
        });

        queryClient.setQueryData<ShoppingListData>(SHOPPING_LIST_QUERY_KEY, {
          categories: updatedCategories,
        });
      }

      // Optimistically add to pantry cache
      if (previousPantry && movedItem) {
        const updatedPantry = { ...previousPantry } as any;
        if (!updatedPantry.categories) {
          updatedPantry.categories = {};
        }
        if (!updatedPantry.categories[movedItem.category]) {
          updatedPantry.categories[movedItem.category] = [];
        }
        updatedPantry.categories[movedItem.category] = [
          ...updatedPantry.categories[movedItem.category],
          { ...movedItem, inStock: true }
        ];
        queryClient.setQueryData(PANTRY_QUERY_KEY, updatedPantry);
      }

      return { previousList, previousPantry };
    },
    onError: (_err, _itemName, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(SHOPPING_LIST_QUERY_KEY, context.previousList);
      }
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
    },
  });
}


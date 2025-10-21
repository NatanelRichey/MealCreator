// Custom hooks for pantry with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPantry,
  addPantryItem,
  editPantryItem,
  deletePantryItem,
  moveToSavedItems,
  moveFromSavedItems,
  moveToCart,
  type PantryData,
  type PantryItem,
} from '@/lib/api';

// Query keys
export const PANTRY_QUERY_KEY = ['pantry'];
export const SHOPPING_LIST_QUERY_KEY = ['shoppingList'];

/**
 * Hook to fetch pantry data with caching
 */
export function usePantry() {
  return useQuery({
    queryKey: PANTRY_QUERY_KEY,
    queryFn: getPantry,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes (pantry changes frequently)
  });
}

/**
 * Hook to add pantry item with optimistic update
 */
export function useAddPantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ category, itemName }: { category: string; itemName: string }) =>
      addPantryItem(category, itemName),
    onMutate: async ({ category, itemName }) => {
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });

      const previousPantry = queryClient.getQueryData<PantryData>(PANTRY_QUERY_KEY);

      // Optimistically add the item
      if (previousPantry) {
        const newItem: PantryItem = {
          _id: `temp-${Date.now()}`,
          name: itemName,
          category,
          owner: '',
          createdAt: new Date(),
        };

        const updatedCategories = { ...previousPantry.categories };
        if (!updatedCategories[category]) {
          updatedCategories[category] = [];
        }
        updatedCategories[category] = [...updatedCategories[category], newItem];

        queryClient.setQueryData<PantryData>(PANTRY_QUERY_KEY, {
          ...previousPantry,
          categories: updatedCategories,
        });
      }

      return { previousPantry };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
    },
  });
}

/**
 * Hook to edit pantry item with optimistic update
 */
export function useEditPantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, newName }: { itemId: string; newName: string }) =>
      editPantryItem(itemId, newName),
    onMutate: async ({ itemId, newName }) => {
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });

      const previousPantry = queryClient.getQueryData<PantryData>(PANTRY_QUERY_KEY);

      if (previousPantry) {
        const updatedCategories = { ...previousPantry.categories };
        
        // Find and update the item
        Object.keys(updatedCategories).forEach((category) => {
          updatedCategories[category] = updatedCategories[category].map((item) =>
            item._id === itemId ? { ...item, name: newName } : item
          );
        });

        const updatedSavedItems = previousPantry.savedItems.map((item) =>
          item._id === itemId ? { ...item, name: newName } : item
        );

        queryClient.setQueryData<PantryData>(PANTRY_QUERY_KEY, {
          categories: updatedCategories,
          savedItems: updatedSavedItems,
        });
      }

      return { previousPantry };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete pantry item with optimistic update
 */
export function useDeletePantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deletePantryItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });

      const previousPantry = queryClient.getQueryData<PantryData>(PANTRY_QUERY_KEY);

      if (previousPantry) {
        const updatedCategories = { ...previousPantry.categories };
        
        // Remove item from all categories
        Object.keys(updatedCategories).forEach((category) => {
          updatedCategories[category] = updatedCategories[category].filter(
            (item) => item._id !== itemId
          );
        });

        const updatedSavedItems = previousPantry.savedItems.filter(
          (item) => item._id !== itemId
        );

        queryClient.setQueryData<PantryData>(PANTRY_QUERY_KEY, {
          categories: updatedCategories,
          savedItems: updatedSavedItems,
        });
      }

      return { previousPantry };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
    },
  });
}

/**
 * Hook to move item to saved items with optimistic update
 */
export function useMoveToSavedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemName: string) => moveToSavedItems(itemName),
    onMutate: async (itemName) => {
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });

      const previousPantry = queryClient.getQueryData<PantryData>(PANTRY_QUERY_KEY);

      if (previousPantry) {
        const updatedCategories = { ...previousPantry.categories };
        let movedItem: PantryItem | null = null;

        // Find and remove the item from categories
        Object.keys(updatedCategories).forEach((category) => {
          const item = updatedCategories[category].find((i) => i.name === itemName);
          if (item) {
            movedItem = item;
            updatedCategories[category] = updatedCategories[category].filter(
              (i) => i.name !== itemName
            );
          }
        });

        // Add to saved items
        const updatedSavedItems = movedItem
          ? [...previousPantry.savedItems, movedItem]
          : previousPantry.savedItems;

        queryClient.setQueryData<PantryData>(PANTRY_QUERY_KEY, {
          categories: updatedCategories,
          savedItems: updatedSavedItems,
        });
      }

      return { previousPantry };
    },
    onError: (_err, _itemName, context) => {
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
    },
  });
}

/**
 * Hook to move item from saved items with optimistic update
 */
export function useMoveFromSavedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemName: string) => moveFromSavedItems(itemName),
    onMutate: async (itemName) => {
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });

      const previousPantry = queryClient.getQueryData<PantryData>(PANTRY_QUERY_KEY);

      if (previousPantry) {
        const movedItem = previousPantry.savedItems.find((i) => i.name === itemName);

        if (movedItem) {
          // Remove from saved items
          const updatedSavedItems = previousPantry.savedItems.filter(
            (i) => i.name !== itemName
          );

          // Add back to category
          const updatedCategories = { ...previousPantry.categories };
          if (!updatedCategories[movedItem.category]) {
            updatedCategories[movedItem.category] = [];
          }
          updatedCategories[movedItem.category] = [
            ...updatedCategories[movedItem.category],
            movedItem,
          ];

          queryClient.setQueryData<PantryData>(PANTRY_QUERY_KEY, {
            categories: updatedCategories,
            savedItems: updatedSavedItems,
          });
        }
      }

      return { previousPantry };
    },
    onError: (_err, _itemName, context) => {
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
    },
  });
}

/**
 * Hook to move item to shopping cart with optimistic update
 */
export function useMoveToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemName: string) => moveToCart(itemName),
    onMutate: async (itemName) => {
      await queryClient.cancelQueries({ queryKey: PANTRY_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });

      const previousPantry = queryClient.getQueryData<PantryData>(PANTRY_QUERY_KEY);
      const previousShoppingList = queryClient.getQueryData(SHOPPING_LIST_QUERY_KEY);

      let movedItem: PantryItem | null = null;

      if (previousPantry) {
        const updatedCategories = { ...previousPantry.categories };
        
        // Find and remove from pantry categories
        Object.keys(updatedCategories).forEach((category) => {
          const item = updatedCategories[category].find((i) => i.name === itemName);
          if (item) {
            movedItem = item;
          }
          updatedCategories[category] = updatedCategories[category].filter(
            (item) => item.name !== itemName
          );
        });

        // Check saved items too
        if (!movedItem) {
          const savedItem = previousPantry.savedItems.find((i) => i.name === itemName);
          if (savedItem) {
            movedItem = savedItem;
          }
        }

        // Remove from saved items
        const updatedSavedItems = previousPantry.savedItems.filter(
          (item) => item.name !== itemName
        );

        queryClient.setQueryData<PantryData>(PANTRY_QUERY_KEY, {
          categories: updatedCategories,
          savedItems: updatedSavedItems,
        });
      }

      // Optimistically add to shopping list cache
      if (previousShoppingList && movedItem) {
        const itemCategory = movedItem.category;
        const updatedShoppingList = { ...previousShoppingList } as any;
        if (!updatedShoppingList.categories) {
          updatedShoppingList.categories = {};
        }
        if (!updatedShoppingList.categories[itemCategory]) {
          updatedShoppingList.categories[itemCategory] = [];
        }
        updatedShoppingList.categories[itemCategory] = [
          ...updatedShoppingList.categories[itemCategory],
          movedItem
        ];
        queryClient.setQueryData(SHOPPING_LIST_QUERY_KEY, updatedShoppingList);
      }

      return { previousPantry, previousShoppingList };
    },
    onError: (_err, _itemName, context) => {
      if (context?.previousPantry) {
        queryClient.setQueryData(PANTRY_QUERY_KEY, context.previousPantry);
      }
      if (context?.previousShoppingList) {
        queryClient.setQueryData(SHOPPING_LIST_QUERY_KEY, context.previousShoppingList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SHOPPING_LIST_QUERY_KEY });
    },
  });
}


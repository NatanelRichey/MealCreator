'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShoppingListItem } from '@/lib/types';
import { PANTRY_CATEGORIES, getCategoryDisplayName } from '@/lib/data';
import {
  useShoppingList,
  useAddShoppingListItem,
  useEditShoppingListItem,
  useDeleteShoppingListItem,
  useMoveToPantry,
} from '@/lib/hooks/useShoppingList';
import { FlashMessage } from '@/components/ui/FlashMessage';
import { CategoryFilter } from '@/components/ui/CategoryFilter';

interface ShoppingListProps {
  items?: ShoppingListItem[];
}

interface FlashMsg {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function ShoppingListOptimized({ items = [] }: ShoppingListProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [flashMessages, setFlashMessages] = useState<FlashMsg[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

  // React Query hooks - with caching and optimistic updates
  const { data: shoppingListData, isLoading, error: queryError } = useShoppingList();
  const addItem = useAddShoppingListItem();
  const editItem = useEditShoppingListItem();
  const deleteItem = useDeleteShoppingListItem();
  const movePantry = useMoveToPantry();

  // Convert backend format to component format
  const allItems: ShoppingListItem[] = [];
  
  if (shoppingListData && shoppingListData.categories) {
    Object.entries(shoppingListData.categories).forEach(([category, items]) => {
      items.forEach((item) => {
        allItems.push({
          ...item,
          checked: false,
          inStock: false,
          quantity: 1,
          unit: 'piece',
          addedDate: item.createdAt,
        });
      });
    });
  }

  // Group items by category
  const itemsByCategory = allItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const showFlash = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setFlashMessages(prev => [...prev, { id, type, message }]);
  };

  const dismissFlash = (id: string) => {
    setFlashMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleAddItem = async (category: string, itemName: string) => {
    if (!itemName.trim()) return;
    
    try {
      // Optimistic update happens automatically!
      await addItem.mutateAsync({ category, itemName: itemName.trim() });
    } catch (err) {
      console.error('Failed to add item:', err);
      showFlash('error', 'Failed to add item. Please try again.');
    }
  };

  const handleToggleCheck = async (itemId: string) => {
    const item = allItems.find(item => item._id === itemId);
    if (!item) return;
    
    // If checking the item, move it to pantry
    try {
      // Instant UI update!
      await movePantry.mutateAsync(item.name);
    } catch (err) {
      console.error('Failed to move to pantry:', err);
      showFlash('error', 'Failed to move to pantry. Please try again.');
    }
  };

  const handleEditItem = async (itemId: string, newName: string) => {
    if (!newName.trim()) return;
    
    try {
      // Instant UI update!
      await editItem.mutateAsync({ itemId, newName: newName.trim() });
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to edit item:', err);
      showFlash('error', 'Failed to edit item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      // Instant UI update!
      await deleteItem.mutateAsync(itemId);
    } catch (err) {
      console.error('Failed to delete item:', err);
      showFlash('error', 'Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 w-full bg-shopping-list bg-cover bg-center flex flex-col overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-meal-overlay pointer-events-none"></div>
      
      {/* Flash Messages - Top Left - Desktop Only */}
      <div className="hidden lg:block fixed top-20 left-4 z-50">
        {flashMessages.map((msg) => (
          <FlashMessage
            key={msg.id}
            type={msg.type}
            message={msg.message}
            onClose={() => dismissFlash(msg.id)}
          />
        ))}
      </div>
      
      {/* Fixed Category Filter at Top */}
      <div className="relative z-10 flex-shrink-0 pointer-events-auto p-4 pb-0">
        <div className="container mx-auto">
          {!isLoading && !queryError && (
            <CategoryFilter 
              currentFilters={categoryFilters}
              onFilterChange={setCategoryFilters}
            />
          )}
        </div>
      </div>
      
      {/* 1mm gap separator */}
      <div className="relative z-10 h-[1mm] flex-shrink-0"></div>
      
      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pointer-events-auto bg-transparent rounded-t-lg">
        <div className="container mx-auto p-4 pt-2 space-y-[1mm]">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-meal-green-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-athiti">Loading shopping list...</p>
          </div>
        )}

        {/* Error State */}
        {queryError && (
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-athiti text-red-600 mb-2">
              Failed to load shopping list. Please try again.
            </h3>
          </div>
        )}

        {/* Render each category */}
        {!isLoading && !queryError && PANTRY_CATEGORIES
          .filter(cat => categoryFilters.length === 0 || categoryFilters.includes(cat))
          .map((category) => {
          const categoryItems = itemsByCategory[category] || [];
          const uncheckedItems = categoryItems.filter(item => !item.checked);
          
          return (
            <div key={category} className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-3 md:p-6">
              {/* Category Header */}
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <Image
                  src={`https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/${category.toLowerCase()}.png`}
                  alt={category}
                  width={32}
                  height={32}
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                <h2 className="text-base md:text-xl font-athiti text-gray-800">
                  {getCategoryDisplayName(category)}
                </h2>
              </div>

              {/* Add Item Form */}
              <div className="mb-2 md:mb-4">
                <div className="flex gap-1 md:gap-2">
                  <input
                    type="text"
                    placeholder="Add Item"
                    id={`shopping-input-${category}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const itemName = input.value.trim();
                        if (itemName) {
                          handleAddItem(category, itemName);
                          input.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded font-athiti text-sm md:text-base focus:ring-2 focus:ring-meal-green focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(`shopping-input-${category}`) as HTMLInputElement;
                      if (input) {
                        const itemName = input.value.trim();
                        if (itemName) {
                          handleAddItem(category, itemName);
                          input.value = '';
                        }
                      }
                    }}
                    disabled={addItem.isPending}
                    className="w-8 h-8 md:w-12 md:h-10 bg-meal-green hover:bg-meal-green-dark rounded flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Image
                      src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/add-pantry.png"
                      alt="Add"
                      width={20}
                      height={20}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {uncheckedItems.length > 0 && (
                <div className="space-y-2">
                  {uncheckedItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-1 md:gap-2 p-1.5 md:p-3 bg-gray-50 rounded border">
                      {/* Move to Pantry Button */}
                      <button
                        onClick={() => handleToggleCheck(item._id!)}
                        disabled={movePantry.isPending}
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-meal-green-light rounded transition-colors disabled:opacity-50"
                        title="Move to Pantry"
                      >
                        <Image
                          src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/add-pantry.png"
                          alt="Move to Pantry"
                          width={20}
                          height={20}
                          className="w-4 h-4 md:w-5 md:h-5"
                        />
                      </button>

                      {/* Item Name */}
                      <div className="flex-1">
                        {editingItem === item._id ? (
                          <input
                            type="text"
                            defaultValue={item.name}
                            onBlur={(e) => handleEditItem(item._id!, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEditItem(item._id!, e.currentTarget.value);
                              }
                              if (e.key === 'Escape') {
                                setEditingItem(null);
                              }
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-meal-green focus:outline-none text-sm md:text-base"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="text-gray-800 font-athiti cursor-pointer hover:text-meal-green text-sm md:text-base"
                            onClick={() => setEditingItem(item._id!)}
                          >
                            {item.name}
                          </span>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteItem(item._id!)}
                        disabled={deleteItem.isPending}
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                      >
                        <Image
                          src="https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/trash.png"
                          alt="Delete"
                          width={20}
                          height={20}
                          className="w-4 h-4 md:w-5 md:h-5"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}


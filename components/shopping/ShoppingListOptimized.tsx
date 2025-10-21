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
    <div className="fixed top-16 bottom-0 left-0 right-0 w-full bg-shopping-list bg-cover bg-center overflow-y-auto">
      {/* Overlay */}
      <div className="absolute inset-0 bg-meal-overlay pointer-events-none"></div>
      
      {/* Flash Messages - Top Left */}
      <div className="fixed top-20 left-4 z-50">
        {flashMessages.map((msg) => (
          <FlashMessage
            key={msg.id}
            type={msg.type}
            message={msg.message}
            onClose={() => dismissFlash(msg.id)}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto p-4 space-y-6 pointer-events-auto">
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
        {!isLoading && !queryError && PANTRY_CATEGORIES.map((category) => {
          const categoryItems = itemsByCategory[category] || [];
          const uncheckedItems = categoryItems.filter(item => !item.checked);
          
          return (
            <div key={category} className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6">
              {/* Category Header */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image
                  src={`https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/${category.toLowerCase()}.png`}
                  alt={category}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h2 className="text-xl font-athiti text-gray-800">
                  {getCategoryDisplayName(category)}
                </h2>
              </div>

              {/* Add Item Form */}
              <div className="mb-4">
                <div className="flex gap-2">
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded font-athiti focus:ring-2 focus:ring-meal-green focus:outline-none"
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
                    className="w-12 h-10 bg-meal-green hover:bg-meal-green-dark rounded flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Image
                      src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/add-pantry.png"
                      alt="Add"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {uncheckedItems.length > 0 && (
                <div className="space-y-2">
                  {uncheckedItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                      {/* Move to Pantry Button */}
                      <button
                        onClick={() => handleToggleCheck(item._id!)}
                        disabled={movePantry.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-meal-green-light rounded transition-colors disabled:opacity-50"
                        title="Move to Pantry"
                      >
                        <Image
                          src="https://res.cloudinary.com/meal-creator/image/upload/v1662276052/icons/add-pantry.png"
                          alt="Move to Pantry"
                          width={20}
                          height={20}
                          className="w-5 h-5"
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
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-meal-green focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="text-gray-800 font-athiti cursor-pointer hover:text-meal-green"
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
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                      >
                        <Image
                          src="https://res.cloudinary.com/meal-creator/image/upload/v1662276054/icons/trash.png"
                          alt="Delete"
                          width={20}
                          height={20}
                          className="w-5 h-5"
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
  );
}


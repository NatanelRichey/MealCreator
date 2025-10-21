'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ShoppingListItem } from '@/lib/types';
import { PANTRY_CATEGORIES, getCategoryDisplayName } from '@/lib/data';
import {
  getShoppingList,
  addShoppingListItem,
  editShoppingListItem,
  deleteShoppingListItem,
  moveToPantry,
} from '@/lib/api';
import { FlashMessage } from '@/components/ui/FlashMessage';

interface ShoppingListProps {
  items?: ShoppingListItem[];
}

interface FlashMsg {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function ShoppingList({ items = [] }: ShoppingListProps) {
  // State management
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>(items);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashMessages, setFlashMessages] = useState<FlashMsg[]>([]);

  // Fetch shopping list from backend
  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getShoppingList();
      
      // Convert backend format to component format
      const allItems: ShoppingListItem[] = [];
      
      // Safety check: make sure categories exists and is an object
      if (data && data.categories && typeof data.categories === 'object') {
        Object.entries(data.categories).forEach(([category, items]) => {
          items.forEach((item) => {
            allItems.push({
              ...item,
              checked: false, // Shopping list items are not checked initially
              inStock: false,
              quantity: 1,
              unit: 'piece',
              addedDate: item.createdAt,
            });
          });
        });
      }
      
      setShoppingItems(allItems);
    } catch (err) {
      console.error('Failed to load shopping list:', err);
      setError('Failed to load shopping list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Group items by category
  const itemsByCategory = shoppingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  // Separate checked and unchecked items
  const uncheckedItems = shoppingItems.filter(item => !item.checked);
  const checkedItems = shoppingItems.filter(item => item.checked);

  const showFlash = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setFlashMessages(prev => [...prev, { id, type, message }]);
  };

  const dismissFlash = (id: string) => {
    setFlashMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Function to add new item to shopping list
  const handleAddItem = async (category: string, itemName: string) => {
    if (!itemName.trim()) return;
    
    const tempId = `temp-${Date.now()}`;
    
    try {
      // Optimistically add to UI first
      const tempItem: ShoppingListItem = {
        _id: tempId,
        name: itemName.trim(),
        category,
        checked: false,
        inStock: false,
        quantity: 1,
        unit: 'piece',
        owner: '',
        addedDate: new Date(),
      };
      setShoppingItems(prev => [...prev, tempItem]);
      
      // Save to backend and get real item with real ID
      const realItem = await addShoppingListItem(category, itemName.trim());
      
      // Replace temp item with real item
      setShoppingItems(prev => 
        prev.map(item => item._id === tempId ? { ...realItem, checked: false, inStock: false, quantity: 1, unit: 'piece' as const, addedDate: realItem.createdAt } : item)
      );
      
    } catch (err) {
      console.error('Failed to add item:', err);
      showFlash('error', 'Failed to add item. Please try again.');
      // Remove the temporary item on error
      setShoppingItems(prev => prev.filter(item => item._id !== tempId));
    }
  };

  // Function to toggle check status (check/uncheck)
  const handleToggleCheck = async (itemId: string) => {
    const item = shoppingItems.find(item => item._id === itemId);
    if (!item) return;
    
    if (!item.checked) {
      // If checking the item, move it to pantry
      handleMoveToPantry(itemId);
    } else {
      // If unchecking, just toggle the status
      setShoppingItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, checked: !item.checked }
            : item
        )
      );
    }
  };

  // Function to edit item name
  const handleEditItem = async (itemId: string, newName: string) => {
    if (!newName.trim()) return;
    
    try {
      await editShoppingListItem(itemId, newName.trim());
      
      // Update local state
      setShoppingItems(prev =>
        prev.map(item =>
          item._id === itemId
            ? { ...item, name: newName.trim() }
            : item
        )
      );
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to edit item:', err);
      showFlash('error', 'Failed to edit item. Please try again.');
    }
  };

  // Function to delete item
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteShoppingListItem(itemId);
      
      // Update local state
      setShoppingItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
      showFlash('error', 'Failed to delete item. Please try again.');
    }
  };

  // Function to move checked item to pantry
  const handleMoveToPantry = async (itemId: string) => {
    const item = shoppingItems.find(item => item._id === itemId);
    if (!item) return;
    
    try {
      await moveToPantry(item.name);
      
      // Remove from shopping list
      setShoppingItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Failed to move to pantry:', err);
      showFlash('error', 'Failed to move to pantry. Please try again.');
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
        {error && (
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-athiti text-red-600 mb-2">
              {error}
            </h3>
            <button
              onClick={loadShoppingList}
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

        {/* Render each category */}
        {!isLoading && !error && PANTRY_CATEGORIES.map((category) => {
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
                    className="w-12 h-10 bg-meal-green hover:bg-meal-green-dark rounded flex items-center justify-center transition-colors"
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
                        className="w-8 h-8 flex items-center justify-center hover:bg-meal-green-light rounded transition-colors"
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
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-100 rounded transition-colors"
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

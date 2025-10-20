'use client';

import { useState } from 'react';
import type { Meal } from '@/lib/types';
import { DEFAULT_MEAL } from '@/lib/data';
import { MealNameSection } from './MealNameSection';
import { IngredientSection } from './IngredientSection';
import { TagSelection } from './TagSelection';
import { ActionButtons } from './ActionButtons';
import { createMeal, updateMeal } from '@/lib/api';
import { FlashMessage } from '@/components/ui/FlashMessage';

interface MealFormProps {
  meal?: Meal;
  onSuccess?: (meal: Meal) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

interface FlashMsg {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function MealForm({ meal, onSuccess, onCancel, onDelete }: MealFormProps) {
  const [formData, setFormData] = useState<Partial<Meal>>(meal || DEFAULT_MEAL);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [flashMessages, setFlashMessages] = useState<FlashMsg[]>([]);

  const showFlash = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setFlashMessages(prev => [...prev, { id, type, message }]);
  };

  const dismissFlash = (id: string) => {
    setFlashMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.mealName?.trim()) {
      showFlash('error', 'Please enter a meal name');
      return;
    }
    
    if (!formData.ingredients || formData.ingredients.length === 0) {
      showFlash('error', 'Please add at least one ingredient');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Prepare meal data for API
      const mealData = {
        mealName: formData.mealName || '',
        description: formData.description || '',
        ingredients: formData.ingredients || [],
        tags: formData.tags || [],
        instructions: formData.instructions || '',
        imgSrc: formData.imgSrc || '',
        prepTime: formData.prepTime || 0,
        cookTime: formData.cookTime || 0,
        servings: formData.servings || 4,
        category: formData.category || '',
      };
      
      let savedMeal: Meal;
      
      if (meal?._id) {
        // Update existing meal
        savedMeal = await updateMeal(meal._id, mealData);
        showFlash('success', 'Meal updated successfully!');
      } else {
        // Create new meal
        savedMeal = await createMeal(mealData);
      }
      
      if (onSuccess) {
        onSuccess(savedMeal);
      }
    } catch (error) {
      console.error('Failed to save meal:', error);
      showFlash('error', 'Failed to save meal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData({ 
        ...formData, 
        ingredients: [...(formData.ingredients || []), currentIngredient.trim()] 
      });
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index)
    });
  };

  const handleTagToggle = (tag: string) => {
    if (formData.tags?.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags?.filter(t => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag]
      });
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setUploadedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imgSrc: previewUrl });
    }
  };

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 w-full bg-meals bg-cover bg-center flex items-center justify-center p-[1cm] overflow-hidden">
      {/* overlay - match original styling */}
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
      
      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-lg shadow-lg px-8 pt-8 pb-6 max-w-4xl w-full max-h-full overflow-hidden pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
          <div className="w-full mb-2">
            <MealNameSection
              value={formData.mealName || ''}
              onChange={(value) => setFormData({ ...formData, mealName: value })}
              currentImage={formData.imgSrc}
              onImageChange={handleImageChange}
            />
          </div>

          <div className="w-full mb-2" style={{ marginTop: '1cm' }}>
            <IngredientSection
              ingredients={formData.ingredients || []}
              currentIngredient={currentIngredient}
              onCurrentIngredientChange={setCurrentIngredient}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
            />
          </div>

          <div className="w-full mb-2" style={{ marginTop: '-2.2cm' }}>
            <TagSelection
              selectedTags={formData.tags || []}
              onTagToggle={handleTagToggle}
            />
          </div>

          <div className="w-full" style={{ marginTop: '-1.5cm' }}>
            <ActionButtons
              onCancel={onCancel}
              onSubmit={() => handleSubmit(new Event('submit') as any)}
              onDelete={onDelete}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}


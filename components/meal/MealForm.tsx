'use client';

import { useState, useEffect } from 'react';
import type { Meal } from '@/lib/types';
import { DEFAULT_MEAL } from '@/lib/data';
import { MealNameSection } from './MealNameSection';
import { IngredientSection } from './IngredientSection';
import { TagSelection } from './TagSelection';
import { ActionButtons } from './ActionButtons';
import { createMeal, updateMeal } from '@/lib/api';
import { FlashMessage } from '@/components/ui/FlashMessage';
import { uploadImageToCloudinary } from '@/lib/uploadImage';

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

  // Update formData when meal prop changes (important for edit form!)
  useEffect(() => {
    if (meal) {
      console.log('Loading meal into form:', meal.mealName, 'Tags:', meal.tags);
      setFormData(meal);
    }
  }, [meal]);

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
      let imageUrl = formData.imgSrc || '';

      // STEP 1: Upload image to Cloudinary if user selected a new image
      if (uploadedImageFile) {
        console.log('📸 Uploading image to Cloudinary...');
        showFlash('success', 'Uploading image...');
        
        try {
          imageUrl = await uploadImageToCloudinary(uploadedImageFile);
          console.log('✅ Image uploaded:', imageUrl);
          showFlash('success', 'Image uploaded successfully!');
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          showFlash('error', 'Image upload failed. Saving meal with default image.');
          // Continue with default image if upload fails
        }
      }

      // STEP 2: Prepare meal data for API
      const mealData = {
        mealName: formData.mealName || '',
        description: formData.description || '',
        ingredients: formData.ingredients || [],
        tags: formData.tags || [],
        instructions: formData.instructions || '',
        imgSrc: imageUrl, // Use uploaded URL or existing URL
        prepTime: formData.prepTime || 0,
        cookTime: formData.cookTime || 0,
        servings: formData.servings || 4,
        category: formData.category || '',
      };
      
      let savedMeal: Meal;
      
      // STEP 3: Save meal to database
      if (meal?._id) {
        // Update existing meal
        console.log('📝 Updating meal...');
        savedMeal = await updateMeal(meal._id, mealData);
        showFlash('success', 'Meal updated successfully!');
      } else {
        // Create new meal
        console.log('📝 Creating new meal...');
        savedMeal = await createMeal(mealData);
        showFlash('success', 'Meal created successfully!');
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
    <div className="fixed top-16 bottom-0 left-0 right-0 w-full bg-meals bg-cover bg-center flex items-center justify-center p-4 sm:p-8 md:p-[1cm] overflow-hidden">
      {/* overlay - match original styling */}
      <div className="absolute inset-0 bg-white/85 pointer-events-none"></div>
      
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
      
      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-lg shadow-lg max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4">
            <div className="w-full mb-2">
              <MealNameSection
                value={formData.mealName || ''}
                onChange={(value) => setFormData({ ...formData, mealName: value })}
                currentImage={formData.imgSrc}
                onImageChange={handleImageChange}
              />
            </div>

            <div className="w-full mb-0 mt-1 sm:mt-2 lg:mt-8 xl:mt-[1cm]">
              <IngredientSection
                ingredients={formData.ingredients || []}
                currentIngredient={currentIngredient}
                onCurrentIngredientChange={setCurrentIngredient}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
              />
            </div>

            <div className="w-full mb-0 -mt-1 sm:-mt-2 lg:-mt-8 xl:-mt-[2.2cm]">
              <TagSelection
                selectedTags={formData.tags || []}
                onTagToggle={handleTagToggle}
              />
            </div>
          </div>

          {/* Fixed Buttons at Bottom - Always Visible */}
          <div className="flex-shrink-0 px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 border-t border-gray-200 bg-white/90">
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


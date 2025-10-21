'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MealNameSectionProps {
  value: string;
  onChange: (value: string) => void;
  currentImage?: string;
  onImageChange: (file: File | null) => void;
}

const DEFAULT_MEAL_IMAGE = 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg';

export function MealNameSection({ value, onChange, currentImage, onImageChange }: MealNameSectionProps) {
  const [imgSrc, setImgSrc] = useState(currentImage || DEFAULT_MEAL_IMAGE);

  // Update imgSrc when currentImage prop changes (for editing existing meals)
  useEffect(() => {
    if (currentImage) {
      setImgSrc(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
    
    // Update preview for newly selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setImgSrc(DEFAULT_MEAL_IMAGE);
  };

  return (
    <div className="w-full mb-4 mt-4">
      {/* Meal Name and Image - Side by Side */}
      <div className="flex items-center justify-center gap-4 w-full">
        {/* Meal Name Input - Left side, smaller */}
        <div className="flex flex-col items-center flex-1 max-w-[280px]">
          <label className="text-xl sm:text-2xl font-athiti mb-2 text-gray-800">Meal Name</label>
          <input
            type="text"
            name="mealName"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Untitled"
            className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg text-base sm:text-lg font-athiti text-center focus:border-meal-green-light focus:outline-none transition-colors"
          />
        </div>

        {/* Image Upload - Right side */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="meal-image-upload"
          />
          <label
            htmlFor="meal-image-upload"
            className="cursor-pointer block"
          >
            {currentImage || imgSrc !== DEFAULT_MEAL_IMAGE ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-meal-green-light hover:border-meal-green transition-colors overflow-hidden">
                <Image 
                  src={imgSrc} 
                  alt="Meal preview"
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 border-2 border-dashed border-meal-green-light rounded-lg flex items-center justify-center hover:border-meal-green transition-colors">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </label>
          <span className="text-[10px] sm:text-xs font-athiti text-gray-500 mt-1 block text-center whitespace-nowrap">Add image</span>
        </div>
      </div>
    </div>
  );
}

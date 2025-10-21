'use client';

import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useState } from 'react';
import type { Meal } from '@/lib/types';

interface MealCardProps {
  meal: Meal;
  index?: number;  // For alternating colors
}

const DEFAULT_MEAL_IMAGE_ID = 'meal-images/untitled-meal';

/**
 * Extract Cloudinary public ID from full URL
 * Example: https://res.cloudinary.com/.../meal-images/pizza.jpg → meal-images/pizza
 * 
 * ALL images are now on Cloudinary after migration!
 */
function getCloudinaryPublicId(url: string): string {
  try {
    if (!url || !url.includes('cloudinary.com')) {
      return DEFAULT_MEAL_IMAGE_ID;
    }
    
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1) {
      const pathParts = parts.slice(uploadIndex + 2);
      return pathParts.join('/').replace(/\.[^/.]+$/, '');
    }
    return DEFAULT_MEAL_IMAGE_ID;
  } catch {
    return DEFAULT_MEAL_IMAGE_ID;
  }
}

export function MealCard({ meal, index = 0 }: MealCardProps) {
  const [hasError, setHasError] = useState(false);
  const publicId = getCloudinaryPublicId(meal.imgSrc);

  return (
    <Link 
      href={`/meals/${meal._id}`}
      className="block rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-gray-100"
    >
      {/* Image Section - All images from Cloudinary CDN ⚡ */}
      <div className="relative h-48 w-full bg-gray-200">
        <CldImage
          src={hasError ? DEFAULT_MEAL_IMAGE_ID : publicId}
          alt={meal.mealName}
          width={400}
          height={300}
          crop="fill"
          gravity="auto"
          quality="auto"
          format="auto"
          className="object-cover w-full h-full"
          onError={() => setHasError(true)}
        />
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Meal Name */}
        <h3 className="font-athiti text-lg mb-2">
          {meal.mealName}
        </h3>
        
        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {meal.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs font-athiti bg-meal-green-light px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}


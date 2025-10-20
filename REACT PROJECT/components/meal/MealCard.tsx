'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Meal } from '@/lib/types';

interface MealCardProps {
  meal: Meal;
  index?: number;  // For alternating colors
}

const DEFAULT_MEAL_IMAGE = 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg';

export function MealCard({ meal, index = 0 }: MealCardProps) {
  const [imgSrc, setImgSrc] = useState(meal.imgSrc || DEFAULT_MEAL_IMAGE);

  return (
    <Link 
      href={`/meals/${meal._id}`}
      className="block rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-gray-100"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={imgSrc}
          alt={meal.mealName}
          fill
          className="object-cover"
          onError={() => setImgSrc(DEFAULT_MEAL_IMAGE)}
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


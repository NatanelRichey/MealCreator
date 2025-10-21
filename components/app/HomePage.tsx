'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { FlashMessage } from '@/components/ui/FlashMessage';

interface HomeCard {
  title: string;
  publicId: string;  // Cloudinary public ID
  href: string;
}

const HOME_CARDS: HomeCard[] = [
  {
    title: 'Find Meal!',
    publicId: 'page-images/suprise',
    href: '/find-meal',
  },
  {
    title: 'Pantry',
    publicId: 'page-images/pantry',
    href: '/pantry',
  },
  {
    title: 'Shopping List',
    publicId: 'page-images/shopping-list',
    href: '/shopping-list',
  },
  {
    title: 'Meals',
    publicId: 'page-images/meals',
    href: '/meals',
  },
];

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFlash, setShowFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState('');

  useEffect(() => {
    const welcome = searchParams.get('welcome');
    if (welcome === 'demo') {
      setFlashMessage('Welcome to the Demo Account! Feel free to explore!');
      setShowFlash(true);
    } else if (welcome === 'default') {
      setFlashMessage('Welcome back!');
      setShowFlash(true);
    }
  }, [searchParams]);

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <section className="fixed top-16 bottom-0 left-0 right-0 flex flex-col overflow-hidden">
      {/* Flash Message - Top Left */}
      {showFlash && (
        <div className="absolute top-4 left-4 z-50">
          <FlashMessage
            type="success"
            message={flashMessage}
            onClose={() => setShowFlash(false)}
          />
        </div>
      )}

      {/* Welcome Message - Very compact on short screens */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1 px-4 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-athiti text-gray-800 text-center mb-0.5">
          Welcome to MealCreator
        </h1>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-athiti text-center max-w-2xl line-clamp-2">
          Plan your meals, manage your pantry, and never forget what to buy. 
          Start by exploring your meals or organizing your pantry!
        </p>
      </div>

      {/* Cards - Fit to available space */}
      <div className="flex items-center justify-center flex-1 w-full px-2 sm:px-4 md:px-8 pb-2 min-h-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-7xl h-full items-center">
        {HOME_CARDS.map((card) => (
          <button
            key={card.title}
            onClick={() => handleCardClick(card.href)}
            className="
              relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-md
              border-2 border-transparent
              transition-colors duration-200 cursor-pointer
              hover:border-gray-300
              w-full h-full
              max-h-[45vh] lg:max-h-[60vh]
            "
            style={{ aspectRatio: '4/5' }}
          >
            <CldImage
              src={card.publicId}
              alt={card.title}
              width={500}
              height={500}
              crop="fill"
              gravity="auto"
              quality="auto"
              format="auto"
              className="w-full h-full object-cover"
            />
            {/* Light overlay to brighten dark images */}
            <div className="absolute inset-0 bg-white/5"></div>
            {/* Blur effect bar like pantry with black text */}
            <div className="absolute -bottom-1 left-0 right-0 h-10 sm:h-12 md:h-14 bg-white/80 backdrop-blur-md flex items-center justify-center transition-none z-10">
              <span className="text-black text-base sm:text-lg md:text-xl font-athiti text-center">
                {card.title}
              </span>
            </div>
          </button>
        ))}
        </div>
      </div>
    </section>
  );
}


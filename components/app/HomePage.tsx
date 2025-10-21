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
    <section className="fixed top-16 bottom-0 left-0 right-0 flex flex-col">
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

      {/* Welcome Message */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-athiti text-gray-800 text-center mb-2">
          Welcome to MealCreator
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-athiti text-center max-w-2xl">
          Plan your meals, manage your pantry, and never forget what to buy. 
          Start by exploring your meals or organizing your pantry!
        </p>
      </div>

      {/* Cards - Always Centered Vertically and Horizontally */}
      <div className="flex items-center justify-center flex-1 w-full px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {HOME_CARDS.map((card) => (
          <button
            key={card.title}
            onClick={() => handleCardClick(card.href)}
            className="
              relative overflow-hidden rounded-2xl shadow-md
              border-2 border-transparent
              transition-colors duration-200 cursor-pointer
              hover:border-gray-300
              w-full aspect-[4/5]
              max-w-80 max-h-96
            "
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
            <div className="absolute -bottom-1 left-0 right-0 h-14 bg-white/80 backdrop-blur-md flex items-center justify-center transition-none z-10">
              <span className="text-black text-xl font-athiti text-center">
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


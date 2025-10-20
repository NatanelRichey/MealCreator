'use client';

import { useRouter } from 'next/navigation';

interface HomeCard {
  title: string;
  image: string;
  href: string;
}

const HOME_CARDS: HomeCard[] = [
  {
    title: 'Find Meal!',
    image: 'https://res.cloudinary.com/meal-creator/image/upload/v1662550742/page-images/suprise.jpg',
    href: '/find-meal',
  },
  {
    title: 'Pantry',
    image: 'https://res.cloudinary.com/meal-creator/image/upload/v1662276036/page-images/pantry.jpg',
    href: '/pantry',
  },
  {
    title: 'Shopping List',
    image: 'https://res.cloudinary.com/meal-creator/image/upload/v1662276045/page-images/shopping-list.jpg',
    href: '/shopping-list',
  },
  {
    title: 'Meals',
    image: 'https://res.cloudinary.com/meal-creator/image/upload/v1662276037/page-images/meals.jpg',
    href: '/meals',
  },
];

export function HomePage() {
  const router = useRouter();

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <section className="flex items-center justify-center h-screen" style={{ padding: '2cm' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full h-full">
        {HOME_CARDS.map((card) => (
          <button
            key={card.title}
            onClick={() => handleCardClick(card.href)}
            className="
              relative overflow-hidden rounded-2xl shadow-md
              transition-transform duration-300 cursor-pointer
              hover:-translate-y-1 hover:shadow-xl
              h-full
            "
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            {/* Light overlay to brighten dark images */}
            <div className="absolute inset-0 bg-white/20"></div>
            {/* Blur effect bar like pantry with black text */}
            <div className="absolute -bottom-1 left-0 right-0 h-14 bg-white/80 backdrop-blur-md flex items-center justify-center transition-none z-10">
              <span className="text-black text-xl font-athiti text-center">
                {card.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}


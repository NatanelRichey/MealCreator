import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MealCreator Color Palette
        'meal-green': {
          DEFAULT: '#6cc82a',
          dark: '#49a705',
          light: '#6cc82a47',
          hover: '#6cc82a3c',
        },
        'meal-success': {
          bg: '#6aff001f',
          border: '#6cc82a82',
        },
        'meal-error': {
          bg: '#ff00002f',
          border: '#ff00005a',
        },
        'meal-grey': {
          DEFAULT: '#6f6f6f',
          light: 'rgba(128, 128, 128, 0.207)',
          hover: 'rgba(128, 128, 128, 0.471)',
        },
        'meal-overlay': 'rgba(255, 255, 255, 0.856)',
      },
      fontFamily: {
        // Your custom fonts from layout.tsx
        athiti: ['var(--font-athiti)', 'sans-serif'],
        indie: ['var(--font-indie-flower)', 'cursive'],
        kalam: ['var(--font-kalam)', 'cursive'],
        nothing: ['var(--font-nothing)', 'cursive'],
      },
      backgroundImage: {
        // Cloudinary background images with optimization transformations
        // Format: /upload/[transformations]/[version]/[path]
        // Transformations: w_1920 (max width), q_auto (auto quality), f_auto (auto format WebP)
        'pantry': "url('https://res.cloudinary.com/meal-creator/image/upload/w_1920,q_auto,f_auto/v1662276036/page-images/pantry.jpg')",
        'shopping-list': "url('https://res.cloudinary.com/meal-creator/image/upload/w_1920,q_auto,f_auto/v1662276045/page-images/shopping-list.jpg')",
        'meals': "url('https://res.cloudinary.com/meal-creator/image/upload/w_1920,q_auto,f_auto/v1662276037/page-images/meals.jpg')",
      },
    },
  },
  plugins: [],
}
export default config


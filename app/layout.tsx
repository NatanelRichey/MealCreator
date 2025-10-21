import type { Metadata } from 'next'
import { Athiti, Indie_Flower, Kalam, Nothing_You_Could_Do } from 'next/font/google'
import './globals.css'
import { ConditionalNavbar } from '@/components/layout/ConditionalNavbar'
import { QueryProvider } from '@/components/providers/QueryProvider'

// ==============================================
// FONT CONFIGURATION
// ==============================================
// Using Google Font 'Inter' - You can change this to any Google Font
// Or use local fonts - see Next.js font documentation
// Primary font - used for body, navbar, most text
const athiti = Athiti({ 
    subsets: ['latin'],
    weight: ['200', '400', '700'],  // Match your old weights
    display: 'swap',
    variable: '--font-athiti',  // CSS variable you can use
  })
  
  // Used for shopping list menu
  const indieFlower = Indie_Flower({
    subsets: ['latin'],
    weight: '400',  // This font only has one weight
    display: 'swap',
    variable: '--font-indie-flower',
  })
  
  // Used for choice buttons and meal text
  const kalam = Kalam({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
    display: 'swap',
    variable: '--font-kalam',
  })
  
  // Used for logo/brand name
  const nothingYouCouldDo = Nothing_You_Could_Do({
    subsets: ['latin'],
    weight: '400',  // This font only has one weight
    display: 'swap',
    variable: '--font-nothing',
  })

// ==============================================
// METADATA (SEO)
// ==============================================
// This appears in browser tabs, search results, and social media shares
// Customize these values for your app
export const metadata: Metadata = {
    title: 'MealCreator - Plan Your Meals & Manage Your Pantry',
    description: 'A meal planning and pantry management app to help you organize your kitchen and discover what to cook.',
    
    icons: {
      icon: '/images/meal-creator-logo.png',
      apple: '/images/meal-creator-logo.png',  // For iOS home screen
    },
    
    // These make your app feel native on mobile (from your old header.ejs lines 6-9)
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'MealCreator',
    },
    
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,  // Prevents zoom on mobile (your old line 9)
    },
    
    keywords: ['meal planning', 'pantry management', 'recipe organization', 'cooking'],
    authors: [{ name: 'Natanel Richey' }],
  }

// ==============================================
// ROOT LAYOUT COMPONENT
// ==============================================
// This wraps your ENTIRE app - every page uses this layout
// Perfect place to add:
//   - Navbar (add it above {children})
//   - Footer (add it below {children})
//   - Theme providers
//   - Analytics
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${athiti.variable} ${indieFlower.variable} ${kalam.variable} ${nothingYouCouldDo.variable} ${athiti.className}`}>
        <QueryProvider>
          <ConditionalNavbar />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper component for nav links - keeps code DRY
  const NavLink = ({ 
    href, 
    children, 
    isLogout = false 
  }: { 
    href: string; 
    children: React.ReactNode; 
    isLogout?: boolean 
  }) => (
    <Link 
      href={href}
      className={`
        font-athiti text-lg min-w-[150px] rounded px-3 py-2 text-center 
        transition-colors duration-300
        ${isLogout ? 'hover:bg-meal-grey-hover' : 'hover:bg-meal-green-hover'}
      `}
    >
      {children}
    </Link>
  );

  // Step 1: Basic Structure & Logo ✅
  // Step 2: Desktop Navigation ✅
  // Step 3: Mobile Hamburger ✅
  // Step 4: Mobile Menu ✅
  // Step 5: Complete! 🎉
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo + Brand */}
          <Link 
            href="/home" 
            className="flex items-center gap-2 font-nothing text-lg hover:opacity-80 transition-opacity"
          >
            <Image
              src="https://res.cloudinary.com/meal-creator/image/upload/v1662276053/icons/meal-creator-logo.png"
              alt="MealCreator Logo"
              width={50}
              height={50}
              className="inline-block"
            />
            <span className="relative top-1">MealCreator</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/medium, visible on large+ screens */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink href="/find-meal">Find Meal!</NavLink>
            <NavLink href="/pantry">Pantry</NavLink>
            <NavLink href="/shopping-list">Shopping List</NavLink>
            <NavLink href="/meals">Meals</NavLink>
            <NavLink href="/" isLogout>Logout</NavLink>
          </div>
          
          {/* Mobile Hamburger - Visible on mobile/medium, hidden on large+ screens */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Image
              src="https://res.cloudinary.com/meal-creator/image/upload/v1662359078/icons/hamburger.png"
              alt="Menu"
              width={30}
              height={30}
            />
          </button>

        </div>

        {/* Mobile Menu - Shows/hides based on isMenuOpen state */}
        {isMenuOpen && (
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-lg border-t" style={{ zIndex: 9999 }}>
            <div className="flex flex-col">
              <Link 
                href="/find-meal"
                onClick={() => setIsMenuOpen(false)}
                className="font-athiti text-lg px-4 py-3 hover:bg-meal-green-hover transition-colors border-b"
              >
                Find Meal!
              </Link>
              <Link 
                href="/pantry"
                onClick={() => setIsMenuOpen(false)}
                className="font-athiti text-lg px-4 py-3 hover:bg-meal-green-hover transition-colors border-b"
              >
                Pantry
              </Link>
              <Link 
                href="/shopping-list"
                onClick={() => setIsMenuOpen(false)}
                className="font-athiti text-lg px-4 py-3 hover:bg-meal-green-hover transition-colors border-b"
              >
                Shopping List
              </Link>
              <Link 
                href="/meals"
                onClick={() => setIsMenuOpen(false)}
                className="font-athiti text-lg px-4 py-3 hover:bg-meal-green-hover transition-colors border-b"
              >
                Meals
              </Link>
              <Link 
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="font-athiti text-lg px-4 py-3 hover:bg-meal-grey-hover transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLogin } from '@/lib/hooks/useAuth';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const handleDefaultLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const result = await loginMutation.mutateAsync('default');
      
      if (result.success) {
        // Redirect to home with welcome message
        router.push('/home?welcome=default');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    
    try {
      const result = await loginMutation.mutateAsync('demo');
      
      if (result.success) {
        // Redirect to home with demo welcome message
        router.push('/home?welcome=demo');
      } else {
        setError('Demo login failed');
      }
    } catch (err) {
      console.error('Demo login failed:', err);
      setError('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 md:p-[2cm] bg-gray-50">
      <div className="w-full h-full max-h-screen bg-white rounded-lg shadow-lg overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b flex-shrink-0">
          <h5 className="text-lg font-athiti text-gray-800">
            Welcome to Meal Creator! - Login
          </h5>
        </div>

        {/* Header Image - High Resolution from Cloudinary */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[430px] overflow-hidden flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/meal-creator/image/upload/v1761061120/meal-creator/login-background.jpg"
            alt="Food"
            fill
            className="object-cover"
            priority={true}
          />
        </div>

        {/* Body */}
        <div className="bg-white flex-1 flex flex-col justify-center items-center py-6 px-4 min-h-[140px]">
          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-center max-w-md">
              <p className="text-red-600 font-athiti">{error}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Login Button (Default Account) */}
            <form onSubmit={handleDefaultLogin}>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="
                  bg-[#28a745] text-white border-none px-6 md:px-10 text-base md:text-lg rounded-lg
                  cursor-pointer transition-colors duration-300 font-athiti
                  h-10 md:h-12 min-w-[100px] md:min-w-[140px] flex items-center justify-center
                  hover:bg-[#218838] shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Login
              </button>
            </form>

            {/* Demo Account Button */}
            <button
              onClick={handleDemoLogin}
              disabled={loginMutation.isPending}
              className="
                bg-[#28a745] text-white border-none px-6 md:px-8 text-base md:text-lg rounded-lg
                cursor-pointer transition-colors duration-300 font-athiti
                whitespace-nowrap h-10 md:h-12 min-w-[140px] md:min-w-[170px] flex items-center justify-center
                hover:bg-[#218838] shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


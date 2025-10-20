'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { demoLogin } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, Login button will just use demo login
    // Later we can add username/password fields
    await handleDemoLogin();
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await demoLogin();
      
      if (result.success) {
        // Redirect to home page after successful login
        router.push('/home');
      } else {
        setError('Demo login failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Demo login failed:', err);
      setError('Demo login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-[2cm] bg-gray-50">
      <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b">
          <h5 className="text-lg font-athiti text-gray-800">
            Welcome to Meal Creator! - Login
          </h5>
        </div>

        {/* Header Image */}
        <div className="relative w-full h-[430px] overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="Food"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body */}
        <div className="bg-white flex-1 flex flex-col justify-center items-center">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 font-athiti">{error}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Login Button (Default Account) */}
            <form onSubmit={handleLogin}>
              <button
                type="submit"
                disabled={isLoading}
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
              disabled={isLoading}
              className="
                bg-[#28a745] text-white border-none px-6 md:px-8 text-base md:text-lg rounded-lg
                cursor-pointer transition-colors duration-300 font-athiti
                whitespace-nowrap h-10 md:h-12 min-w-[140px] md:min-w-[170px] flex items-center justify-center
                hover:bg-[#218838] shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              🎓 Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


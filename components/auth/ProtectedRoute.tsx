'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const { authenticated } = await checkAuth();
      
      if (!authenticated) {
        // Redirect to login if not authenticated
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    };

    verifyAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-meal-green-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If authenticated, render the children
  return <>{children}</>;
}


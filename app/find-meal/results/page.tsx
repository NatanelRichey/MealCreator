import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import FilteredMealsContent from './FilteredMealsContent';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function FilteredMealsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="fixed top-16 bottom-0 left-0 right-0 bg-meals bg-cover bg-center overflow-y-auto">
          <div className="absolute inset-0 bg-white/85 pointer-events-none"></div>
          <div className="relative z-10 container mx-auto p-8 pointer-events-auto">
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-meal-green-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-athiti">Loading...</p>
            </div>
          </div>
        </div>
      }>
        <FilteredMealsContent />
      </Suspense>
    </ProtectedRoute>
  );
}


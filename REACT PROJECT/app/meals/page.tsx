'use client';

import { useRouter } from 'next/navigation';
import { MealsPage } from '@/components/meal/MealsPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function MealsPageRoute() {
  const router = useRouter();

  const handleAddMeal = () => {
    // TODO: Navigate to meal creation form
    router.push('/meals/new');
  };

  const handleEditMeal = (meal: any) => {
    // TODO: Navigate to meal edit form
    router.push(`/meals/edit/${meal._id}`);
  };

  return (
    <ProtectedRoute>
      <MealsPage
        onAddMeal={handleAddMeal}
        onMealEdit={handleEditMeal}
      />
    </ProtectedRoute>
  );
}


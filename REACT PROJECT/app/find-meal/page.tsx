import { MealSelector } from '@/components/app/MealSelector';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FindMealPage() {
  return (
    <ProtectedRoute>
      <MealSelector />
    </ProtectedRoute>
  );
}


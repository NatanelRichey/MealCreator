import { MealSelector } from '@/components/app/MealSelector';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function FindMealPage() {
  return (
    <ProtectedRoute>
      <MealSelector />
    </ProtectedRoute>
  );
}


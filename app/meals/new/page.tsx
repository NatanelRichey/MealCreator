'use client';

import { useRouter } from 'next/navigation';
import { MealForm } from '@/components/meal/MealForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function NewMealPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to meals page after successful creation
    router.push('/meals');
  };

  const handleCancel = () => {
    // Go back to meals page
    router.push('/meals');
  };

  return (
    <ProtectedRoute>
      <MealForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </ProtectedRoute>
  );
}


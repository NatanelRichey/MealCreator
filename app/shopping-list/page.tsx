import { ShoppingListOptimized } from '@/components/shopping/ShoppingListOptimized';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingListOptimized />
    </ProtectedRoute>
  );
}


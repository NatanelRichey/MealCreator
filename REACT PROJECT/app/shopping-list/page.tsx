import { ShoppingList } from '@/components/shopping/ShoppingList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingList />
    </ProtectedRoute>
  );
}


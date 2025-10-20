import { ShoppingList } from '@/components/shopping/ShoppingList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingList />
    </ProtectedRoute>
  );
}


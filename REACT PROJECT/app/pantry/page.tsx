import { Pantry } from '@/components/pantry/Pantry';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function PantryPage() {
  return (
    <ProtectedRoute>
      <Pantry />
    </ProtectedRoute>
  );
}


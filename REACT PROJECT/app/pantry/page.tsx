import { Pantry } from '@/components/pantry/Pantry';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function PantryPage() {
  return (
    <ProtectedRoute>
      <Pantry />
    </ProtectedRoute>
  );
}


import { HomePage } from '@/components/app/HomePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function HomePageRoute() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}


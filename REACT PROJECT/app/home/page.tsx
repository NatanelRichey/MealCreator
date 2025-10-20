import { HomePage } from '@/components/app/HomePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function HomePageRoute() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}


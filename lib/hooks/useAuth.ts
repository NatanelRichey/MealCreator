// Custom hook for authentication with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser, logoutUser, getCurrentUser, type User } from '@/lib/api';

// Query key for authentication
export const AUTH_QUERY_KEY = ['auth', 'currentUser'];

/**
 * Hook to get current user authentication status
 * Uses React Query for caching
 */
export function useAuth() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => {
      const user = getCurrentUser();
      return user;
    },
    // Check auth status on mount and when window regains focus
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for login mutation
 * Optimistically updates cache
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => loginUser(username),
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Update the auth cache immediately
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
    },
  });
}

/**
 * Hook for logout mutation
 * Clears all cached data
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
}


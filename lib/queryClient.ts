// React Query configuration for caching and performance optimization
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 10 minutes (longer for mobile)
      staleTime: 1000 * 60 * 10,
      // Keep unused data in cache for 30 minutes
      gcTime: 1000 * 60 * 30,
      // Retry failed requests once
      retry: 1,
      // Disable refetch on window focus (prevents iOS tab switching refetch)
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data is still fresh
      refetchOnMount: false,
      // Don't refetch on reconnect (prevents mobile network switching refetch)
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});


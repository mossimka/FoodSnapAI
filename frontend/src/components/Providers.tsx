'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { AuthInitializer } from './AuthInitializer';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthInitializer>
    </QueryClientProvider>
  );
} 
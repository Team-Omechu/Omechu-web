'use client'
import { ReactNode, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

export function Providers({ children }: { children: ReactNode }) {
  // 클라이언트에서만 실행되도록 useState 안에서 생성
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AUTH_SESSION_CHANGED_EVENT } from "@/utils/apiClient";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    const limparCache = () => {
      queryClient.clear();
    };
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, limparCache);
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, limparCache);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

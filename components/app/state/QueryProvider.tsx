"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AUTH_SESSION_CHANGED_EVENT,
  USER_PROFILE_UPDATED_EVENT,
  type UserProfile,
} from "@/utils/apiClient";

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
    const atualizarPerfilCache = (event: Event) => {
      const customEvent = event as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        queryClient.setQueryData(["me"], customEvent.detail);
      }
    };
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, limparCache);
    window.addEventListener(USER_PROFILE_UPDATED_EVENT, atualizarPerfilCache);
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, limparCache);
      window.removeEventListener(USER_PROFILE_UPDATED_EVENT, atualizarPerfilCache);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

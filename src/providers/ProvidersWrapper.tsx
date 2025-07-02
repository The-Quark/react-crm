import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/auth/providers/JWTProvider';
import {
  CurrencyProvider,
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  TranslationProvider
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { CACHE_TIME_ZERO } from '@/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIME_ZERO,
      refetchOnWindowFocus: true
    }
  }
});

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <CurrencyProvider>
            <TranslationProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <MenusProvider>{children}</MenusProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </TranslationProvider>
          </CurrencyProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };

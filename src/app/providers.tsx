'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { store } from '@/core/store';
import { theme } from '@/styles/theme';
import { DeviceInfoProvider } from '@/lib/responsive/deviceContext';
import { AgeRestrictionProvider } from '@/features/ageRestriction/ageRestrictionContext';

const clientSideEmotionCache = createCache({ key: 'css' });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <CacheProvider value={clientSideEmotionCache}>
          <ThemeProvider theme={theme}>
            <DeviceInfoProvider>
              <AgeRestrictionProvider>
                {children}
              </AgeRestrictionProvider>
            </DeviceInfoProvider>
          </ThemeProvider>
        </CacheProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}

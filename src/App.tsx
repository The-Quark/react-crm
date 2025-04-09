import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSettings } from '@/providers/SettingsProvider';
import { AppRouting } from '@/routing';
import { PathnameProvider } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { useAuthContext } from '@/auth';
import { ScreenLoader } from '@/components';

const { BASE_URL } = import.meta.env;

const App = () => {
  const { settings } = useSettings();
  const { currentUser } = useAuthContext();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);

  if (currentUser === undefined) {
    return <ScreenLoader />;
  }

  return (
    <BrowserRouter
      basename={BASE_URL}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
      <Toaster />
    </BrowserRouter>
  );
};

export { App };

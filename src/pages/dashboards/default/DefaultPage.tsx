import { useLayout } from '@/providers';
import { DashboardPage } from '@/pages/dashboards/dashboard/dashboardPage.tsx';

const DefaultPage = () => {
  const { currentLayout } = useLayout();

  if (currentLayout?.name === 'demo1-layout') {
    return <DashboardPage />;
  }
};

export { DefaultPage };

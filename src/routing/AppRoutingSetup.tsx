import React, { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AuthPage, useAuthContext } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { ErrorsRouting } from '@/errors';
import { useCurrentUser } from '@/api';
import { ScreenLoader } from '@/components';
import AllRoutesSetting from '@/routing/routingByRole/allRoutesSetting.tsx';
import { Demo1Layout } from '@/layouts/demo1';
import ViewerRoutesSetting from '@/routing/routingByRole/viewerRoutesSetting.tsx';

const AppRoutingSetup = (): ReactElement => {
  const { isLoading, data: currentUser } = useCurrentUser();
  const { auth } = useAuthContext();
  if (isLoading) {
    return <ScreenLoader />;
  }
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          {!auth && <Route path="/*" />}
          {!isLoading &&
            currentUser &&
            (currentUser.roles[0].name === 'superadmin' ||
              currentUser.roles[0].name === 'viewer') && (
              <Route path="/*" element={<AllRoutesSetting />} />
            )}
          {!isLoading && currentUser && currentUser.roles[0].name === 'viewer' && (
            <Route path="/*" element={<ViewerRoutesSetting />} />
          )}
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };

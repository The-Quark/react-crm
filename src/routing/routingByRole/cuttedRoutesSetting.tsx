import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import { GlobalParameterViewPage } from '@/pages/global-parameters';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';

const CuttedRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/global-parameters/view-parameters/:id"
          element={<GlobalParameterViewPage />}
        />
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default CuttedRoutesSetting;

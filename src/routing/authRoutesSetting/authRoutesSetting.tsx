import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AuthPage } from '@/auth';
import { ErrorsRouting } from '@/errors';

const AuthRoutesSetting = (): ReactElement => {
  return (
    <Routes>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AuthRoutesSetting };

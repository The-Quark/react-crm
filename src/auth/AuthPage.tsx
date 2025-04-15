import { Navigate, Route, Routes } from 'react-router';
import {
  Login,
  ResetPassword,
  ResetPasswordChange,
  ResetPasswordChanged,
  ResetPasswordCheckEmail,
  ResetPasswordEnterEmail,
  Signup,
  TwoFactorAuth
} from './pages/jwt';
import { AuthLayout } from '@/layouts/auth';
import { CheckEmail } from '@/auth/pages/jwt';

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/reset-password_token" element={<ResetPassword />} />
      <Route path="/reset-password_token/enter-email" element={<ResetPasswordEnterEmail />} />
      <Route path="/reset-password_token/check-email" element={<ResetPasswordCheckEmail />} />
      <Route path="/password_recovery_change_token" element={<ResetPasswordChange />} />
      <Route path="/reset-password_token/changed" element={<ResetPasswordChanged />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Route>
  </Routes>
);

export { AuthPage };

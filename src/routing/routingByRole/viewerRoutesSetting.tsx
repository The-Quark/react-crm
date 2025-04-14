import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import { GlobalParametersListPage, GlobalParameterViewPage } from '@/pages/global-parameters';
import { PermissionPage, RolesPage } from '@/pages/roles-permissions';
import ClientsPage from '@/pages/clients/clientsPage.tsx';
import StaffPage from '@/pages/hr-module/staff/staffPage.tsx';
import DriversPage from '@/pages/hr-module/drivers/driversPage.tsx';
import CouriersPage from '@/pages/hr-module/couriers/couriersPage.tsx';
import ApplicationsPage from '@/pages/call-center/applications/applicationsPage.tsx';
import OrdersPage from '@/pages/call-center/orders/ordersPage.tsx';
import { MemberPublicProfilePage, MembersPage, TeamsPage } from '@/pages/crm';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';

const ViewerRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/global-parameters/parameters" element={<GlobalParametersListPage />} />
        <Route
          path="/global-parameters/view-parameters/:id"
          element={<GlobalParameterViewPage />}
        />
        <Route path="/roles-permissions/roles" element={<RolesPage />} />
        <Route path="/roles-permissions/permissions" element={<PermissionPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/hr-module/staff" element={<StaffPage />} />
        <Route path="/hr-module/drivers" element={<DriversPage />} />
        <Route path="/hr-module/couriers" element={<CouriersPage />} />
        <Route path="/call-center/applications" element={<ApplicationsPage />} />
        <Route path="/call-center/orders" element={<OrdersPage />} />
        <Route path="/crm/teams" element={<TeamsPage />} />
        <Route path="/crm/members" element={<MembersPage />} />
        <Route path="/crm/member/profile/:id" element={<MemberPublicProfilePage />} />
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default ViewerRoutesSetting;

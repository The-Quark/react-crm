import { KeenIcon, Tab, TabPanel, Tabs, TabsList } from '@/components';
import { MenuSub } from '@/components/menu';
import { INotificationResponse } from '@/api/get/getUser/getUserNotifications/types.ts';
import { DropdownNotificationsTask } from '@/partials/dropdowns/notifications/DropdownNotificationsTask.tsx';
import { DropdownNotificationsApplication } from '@/partials/dropdowns/notifications/DropdownNotificationsApplication.tsx';
import React from 'react';

interface IDropdownNotificationProps {
  menuTtemRef: any;
  notifications?: INotificationResponse;
  isLoading?: boolean;
  isError?: boolean;
  onTypeChange: (type: 'task' | 'application') => void;
  currentType: 'task' | 'application';
  onPageChange: (page: number) => void;
  currentPage: number;
}

const DropdownNotifications = ({
  menuTtemRef,
  notifications,
  isError,
  isLoading,
  onTypeChange,
  currentType,
  onPageChange,
  currentPage
}: IDropdownNotificationProps) => {
  const handleClose = () => {
    if (menuTtemRef.current) {
      menuTtemRef.current.hide();
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent | null, value: string | number | null) => {
    const type = value === 1 ? 'task' : 'application';
    onTypeChange(type);
  };

  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5 border-b border-b-gray-200">
        Notifications
        <button className="btn btn-sm btn-icon btn-light btn-clear shrink-0" onClick={handleClose}>
          <KeenIcon icon="cross" />
        </button>
      </div>
    );
  };

  const buildTabs = () => {
    return (
      <Tabs value={currentType === 'task' ? 1 : 2} className="" onChange={handleTabChange}>
        <TabsList className="justify-between px-5 mb-2">
          <div className="flex items-center gap-5">
            <Tab value={1}>Tasks</Tab>
            <Tab value={2}>Applications</Tab>
          </div>
        </TabsList>
        <TabPanel value={1}>
          <DropdownNotificationsTask
            notifications={notifications?.result}
            isLoading={isLoading}
            isError={isError}
            currentPage={currentPage === 0 ? currentPage + 1 : currentPage}
            onPageChange={onPageChange}
            total={notifications?.total}
            lastPage={notifications?.last_page}
          />
        </TabPanel>
        <TabPanel value={2}>
          <DropdownNotificationsApplication
            notifications={notifications?.result}
            isLoading={isLoading}
            isError={isError}
            currentPage={currentPage === 0 ? currentPage + 1 : currentPage}
            onPageChange={onPageChange}
            total={notifications?.total}
            lastPage={notifications?.last_page}
          />
        </TabPanel>
      </Tabs>
    );
  };

  return (
    <MenuSub rootClassName="w-full max-w-[460px]" className="light:border-gray-300">
      {buildHeader()}
      {buildTabs()}
    </MenuSub>
  );
};

export { DropdownNotifications };

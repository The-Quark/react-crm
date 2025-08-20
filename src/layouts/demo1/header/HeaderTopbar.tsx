import { useRef, useState } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuLink, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { useLanguage } from '@/i18n';
import { getUserNotifications } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { INotificationResponse } from '@/api/get/getUser/getUserNotifications/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);
  const [notificationType, setNotificationType] = useState<'task' | 'application'>('task');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';
  const isAdmin = currentUser?.roles[0].name === 'superadmin';

  const { data, isLoading, isError } = useQuery<INotificationResponse>({
    queryKey: ['notifications', notificationType, pageIndex],
    queryFn: () =>
      getUserNotifications({
        type: notificationType,
        per_page: 5,
        page: pageIndex
      }),
    refetchInterval: 10000,
    staleTime: 5000
  });

  const hasUnreadNotifications =
    !isLoading &&
    !isError &&
    Array.isArray(data) &&
    data.some((notification) => notification.read_at === null);

  const handleNotificationTypeChange = (type: 'task' | 'application') => {
    setNotificationType(type);
    setPageIndex(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      {canManage && (
        <>
          <Menu>
            <MenuItem>
              <MenuLink
                path="/drafts"
                className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500"
              >
                <KeenIcon icon="scroll" />
              </MenuLink>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem>
              <MenuLink
                path="/trash"
                className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500"
              >
                <KeenIcon icon="trash-square" />
              </MenuLink>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem>
              <MenuLink
                path="/call-center/fast-form/start"
                className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500"
              >
                <KeenIcon icon="rocket" />
              </MenuLink>
            </MenuItem>
          </Menu>
        </>
      )}

      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
            {hasUnreadNotifications && (
              <span className="absolute top-0 right-0 size-2.5 bg-danger rounded-full border-2"></span>
            )}
          </MenuToggle>
          {DropdownNotifications({
            menuTtemRef: itemNotificationsRef,
            notifications: data,
            isLoading,
            isError,
            onTypeChange: handleNotificationTypeChange,
            currentType: notificationType,
            onPageChange: handlePageChange,
            currentPage: pageIndex
          })}
        </MenuItem>
      </Menu>
      {isAdmin && (
        <Menu>
          <MenuItem>
            <MenuLink
              path="/admin-logs"
              className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500"
            >
              <KeenIcon icon="message-programming" />
            </MenuLink>
          </MenuItem>
        </Menu>
      )}

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={
                currentUser?.avatar
                  ? `${STORAGE_URL}/${currentUser.avatar}`
                  : toAbsoluteUrl('/media/avatars/blank.png')
              }
              alt="avatar"
            />
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };

import { FC, useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import { NotificationResponse } from '@/api/get/getUser/getUserNotifications/types.ts';
import { DropdownNotificationsItemCard } from '@/partials/dropdowns/notifications/items/DropdownNotificationsItemCard.tsx';

interface IDropdownNotificationsAllProps {
  notifications: NotificationResponse[];
  isLoading?: boolean;
  isError?: boolean;
}

const DropdownNotificationsAll: FC<IDropdownNotificationsAllProps> = ({
  notifications,
  isLoading,
  isError
}) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 300;

  useEffect(() => {
    if (footerRef.current) {
      const footerHeight = getHeight(footerRef.current);
      const availableHeight = viewportHeight - footerHeight - offset;
      setListHeight(availableHeight);
    }
  }, [viewportHeight]);

  const buildList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex justify-center items-center h-32 text-danger">
          Failed to load notifications
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex justify-center items-center h-32 text-gray-500">
          No notifications found
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5 pt-3 pb-4 divider-y divider-gray-200">
        {notifications.map((notification) => (
          <DropdownNotificationsItemCard key={notification.id} notification={notification} />
        ))}
      </div>
    );
  };

  const buildFooter = () => {
    return (
      <>
        <div className="border-b border-b-gray-200"></div>
        <div className="grid grid-cols-2 p-5 gap-2.5">
          {/*<button className="btn btn-sm btn-light justify-center">Archive all</button>*/}
          {/*<button className="btn btn-sm btn-light justify-center">Mark all as read</button>*/}
        </div>
      </>
    );
  };

  return (
    <div className="grow">
      <div className="scrollable-y-auto" style={{ maxHeight: `${listHeight}px` }}>
        {buildList()}
      </div>
      <div ref={footerRef}>{buildFooter()}</div>
    </div>
  );
};

export { DropdownNotificationsAll };

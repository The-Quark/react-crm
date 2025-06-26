import { FC, useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import { NotificationResponse } from '@/api/get/getUser/getUserNotifications/types.ts';
import { DropdownNotificationsTaskCard } from '@/partials/dropdowns/notifications/items/DropdownNotificationsTaskCard.tsx';
import { KeenIcon } from '@/components';
import { useIntl } from 'react-intl';

interface IDropdownNotificationsTaskProps {
  notifications?: NotificationResponse[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  total?: number;
  lastPage?: number;
}

const DropdownNotificationsTask: FC<IDropdownNotificationsTaskProps> = ({
  notifications,
  isLoading,
  isError,
  onPageChange,
  currentPage,
  total,
  lastPage
}) => {
  const { formatMessage } = useIntl();
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

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < (lastPage ?? 1)) {
      onPageChange(currentPage + 1);
    }
  };

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
          {formatMessage({ id: 'NOTIFICATION.FAILED' })}
        </div>
      );
    }

    if (notifications?.length === 0) {
      return (
        <div className="flex justify-center items-center h-32 text-gray-500">
          {formatMessage({ id: 'NOTIFICATION.EMPTY' })}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5 pt-3 pb-4 divider-y divider-gray-200">
        {notifications?.map((notification) => (
          <DropdownNotificationsTaskCard key={notification.id} notification={notification} />
        ))}
      </div>
    );
  };

  const buildFooter = () => {
    return (
      <>
        <div className="border-b border-b-gray-200"></div>
        <div className="grid grid-cols-3 p-5 gap-2.5 items-center">
          <button
            className="btn btn-sm btn-light justify-center"
            onClick={handlePrevious}
            disabled={currentPage <= 1 || isLoading}
          >
            <KeenIcon icon="arrow-left" />
          </button>
          <div className="text-center text-sm text-gray-500">
            {formatMessage(
              { id: 'NOTIFICATION.PAGE_LABEL' },
              { current: currentPage, total: lastPage }
            )}
          </div>
          <button
            className="btn btn-sm btn-light justify-center"
            onClick={handleNext}
            disabled={currentPage >= (total ?? 1) || isLoading}
          >
            <KeenIcon icon="arrow-right" />
          </button>
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

export { DropdownNotificationsTask };

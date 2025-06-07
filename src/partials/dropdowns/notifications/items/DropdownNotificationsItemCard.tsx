import { NotificationResponse } from '@/api/get/getUser/getUserNotifications/types';
import { Link } from 'react-router-dom';

interface DropdownNotificationsItemCardProps {
  notification: NotificationResponse;
}

const DropdownNotificationsItemCard = ({ notification }: DropdownNotificationsItemCardProps) => {
  return (
    <div className="flex grow gap-2.5 px-5">
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <div className="text-2sm font-medium">
              <Link
                to={`/tasks/view/${notification.data.task_id}`}
                className="hover:text-primary-active text-gray-900 font-semibold"
              >
                {notification.data.title}
              </Link>
            </div>
            <span className="text-gray-700 text-2sm"> {notification.data.description} </span>
            <span className="flex items-center text-2xs font-medium text-gray-500">
              {new Date(notification.created_at).toLocaleString()}
              {notification.read_at === null && (
                <span className="badge badge-circle bg-danger size-1 mx-1.5"></span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DropdownNotificationsItemCard };

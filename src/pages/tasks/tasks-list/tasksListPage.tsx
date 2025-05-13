import { SharedHeader } from '@/partials/sharedUI';
import { TasksListContent } from '@/pages/tasks/tasks-list/components/tasksListContent.tsx';

export const TasksListPage = () => {
  return (
    <>
      <SharedHeader />
      <TasksListContent />
    </>
  );
};

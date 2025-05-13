import { useParams } from 'react-router';
import { getTask } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { TasksViewContentCard } from '@/pages/tasks/tasks-view/components/blocks/tasksViewContentCard.tsx';

const TasksViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['task-id', id],
    queryFn: () => getTask(Number(id))
  });

  if (isLoading) {
    return <SharedLoading />;
  }

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <TasksViewContentCard task={data?.result[0] ?? null} />
    </div>
  );
};

export { TasksViewContent };

/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getTask } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useTasksColumns } from '@/pages/tasks/tasks-list/components/blocks/tasksColumns.tsx';
import { TasksToolbar } from '@/pages/tasks/tasks-list/components/blocks/tasksToolbar.tsx';

export const TasksListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTask(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useTasksColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <div className="grid gap-5 lg:gap-7.5">
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<TasksToolbar />}
          layout={{ card: true }}
          messages={{
            empty: isLoading && <SharedLoading />
          }}
        />
      </div>
    </Container>
  );
};

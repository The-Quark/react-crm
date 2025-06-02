/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getTask } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useTasksColumns } from '@/pages/tasks/tasks-list/components/blocks/tasksColumns.tsx';
import { TasksToolbar } from '@/pages/tasks/tasks-list/components/blocks/tasksToolbar.tsx';
import { useState } from 'react';

export const TasksListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tasks', pageIndex, pageSize, searchTerm],
    queryFn: () => getTask(undefined, pageSize, pageIndex + 1, searchTerm),
    staleTime: 1000 * 60 * 5
  });

  const columns = useTasksColumns();

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    console.log('Fetching with:', params); // для отладки
    setPageIndex(params.pageIndex);
    setPageSize(params.pageSize);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPageIndex(0), setPageSize(15);
  };

  if (isError) {
    return <SharedError error={error} />;
  }
  if (!data) {
    return <SharedLoading />;
  }

  return (
    <Container>
      <div className="grid gap-5 lg:gap-7.5">
        <DataGrid
          columns={columns}
          data={data?.result || []}
          rowSelection={true}
          pagination={{
            page: pageIndex,
            size: pageSize,
            info: `Total: ${data?.total || 0} items`
          }}
          onFetchData={handleFetchData}
          toolbar={<TasksToolbar onSearch={handleSearch} />}
          layout={{ card: true }}
          messages={{
            empty: isPending && <SharedLoading simple />
          }}
          serverSide
        />
      </div>
    </Container>
  );
};

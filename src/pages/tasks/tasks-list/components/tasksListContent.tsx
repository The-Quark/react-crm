/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getTask } from '@/api/get';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { useTasksColumns } from '@/pages/tasks/tasks-list/components/blocks/tasksColumns.tsx';
import { TasksToolbar } from '@/pages/tasks/tasks-list/components/blocks/tasksToolbar.tsx';
import { useState } from 'react';
import { ITasksResponse } from '@/api/get/getTask/types.ts';
import { deleteTask } from '@/api';

export const TasksListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const queryClient = useQueryClient();

  const { data, isError, error, isFetching, isPending } = useQuery<ITasksResponse>({
    queryKey: ['tasks', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getTask({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        title: searchTerm
      })
  });

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);
    try {
      await deleteTask(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const columns = useTasksColumns({
    onDeleteClick: handleDeleteClick
  });

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={data?.result || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={<TasksToolbar onSearch={handleSearch} />}
        pagination={{
          page: pagination.pageIndex,
          size: pagination.pageSize,
          total: data?.total || 0
        }}
        messages={{
          empty: isPending && <SharedLoading simple />,
          loading: isFetching && <SharedLoading simple />
        }}
      />
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </Container>
  );
};

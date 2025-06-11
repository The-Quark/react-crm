import React from 'react';
import { Container } from '@/components';
import { TasksStarterContent } from '@/pages/tasks/tasks-starter/components/tasksStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getTask } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const TasksStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: taskData,
    isLoading: taskLoading,
    isError: taskIsError,
    error: taskError
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask({ id: id ? parseInt(id) : undefined }),
    enabled: isEditMode
  });

  if (isEditMode && taskIsError) {
    return <SharedError error={taskError} />;
  }

  return (
    <Container>
      {isEditMode && taskLoading ? (
        <SharedLoading />
      ) : (
        <TasksStarterContent
          isEditMode={isEditMode}
          taskId={Number(id)}
          taskData={taskData?.result[0]}
        />
      )}
    </Container>
  );
};

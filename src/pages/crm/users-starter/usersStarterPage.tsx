import React from 'react';
import { Container } from '@/components';
import { UsersStarterContent } from '@/pages/crm/users-starter/components/usersStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const UsersStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersIsError,
    error: usersError
  } = useQuery({
    queryKey: ['usersID', id],
    queryFn: () => getUserByParams({ id: Number(id) }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    enabled: isEditMode
  });

  if (isEditMode && usersIsError) {
    return <SharedError error={usersError} />;
  }
  return (
    <Container>
      {isEditMode && usersLoading ? (
        <SharedLoading />
      ) : (
        <UsersStarterContent usersData={usersData} isEditMode={isEditMode} userId={Number(id)} />
      )}
    </Container>
  );
};

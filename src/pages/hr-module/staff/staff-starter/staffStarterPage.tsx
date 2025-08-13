import React from 'react';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { StaffStarterContent } from '@/pages/hr-module/staff/staff-starter/components/staffStarterContent.tsx';

export const StaffStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersIsError,
    error: usersError
  } = useQuery({
    queryKey: ['staffID', id],
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
        <StaffStarterContent usersData={usersData} isEditMode={isEditMode} userId={Number(id)} />
      )}
    </Container>
  );
};

import React from 'react';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { CouriersStarterContent } from '@/pages/hr-module/couriers/couriers-starter/components/couriersStarterContent.tsx';

export const CouriersStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersIsError,
    error: usersError
  } = useQuery({
    queryKey: ['couriersID', id],
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
        <CouriersStarterContent usersData={usersData} isEditMode={isEditMode} userId={Number(id)} />
      )}
    </Container>
  );
};

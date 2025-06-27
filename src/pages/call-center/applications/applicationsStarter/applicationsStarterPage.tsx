import React from 'react';
import { ApplicationsStarterContent } from '@/pages/call-center/applications/applicationsStarter/components/applicationsStarterContent.tsx';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const ApplicationsStarterPage = () => {
  const { id } = useParams<{ id: string }>();

  const isEditMode = !!id;

  const {
    data: applicationData,
    isLoading: applicationLoading,
    isError: applicationIsError,
    error: applicationError
  } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplications({ id: id ? parseInt(id) : undefined }),
    enabled: isEditMode
  });

  if (isEditMode && applicationIsError) {
    return <SharedError error={applicationError} />;
  }

  return (
    <Container>
      {isEditMode && applicationLoading ? (
        <SharedLoading />
      ) : (
        <ApplicationsStarterContent
          isEditMode={isEditMode}
          applicationId={Number(id)}
          applicationData={applicationData?.result[0]}
        />
      )}
    </Container>
  );
};

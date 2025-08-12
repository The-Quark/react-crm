import React from 'react';
import { ApplicationsStarterContent } from '@/pages/call-center/applications/applicationsStarter/components/applicationsStarterContent.tsx';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

export const ApplicationsStarterPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { formatMessage } = useIntl();
  const isEditMode = !!id;
  const applicationId = id ? parseInt(id, 10) : undefined;

  const {
    data: applicationData,
    isLoading: applicationLoading,
    isError: applicationIsError,
    error: applicationError
  } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplications({ id: applicationId }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    enabled: isEditMode
  });

  if (isEditMode && (applicationId === undefined || isNaN(applicationId))) {
    return <SharedError error={new Error(formatMessage({ id: 'SYSTEM.ERROR.INVALID_ID' }))} />;
  }
  if (isEditMode && applicationIsError) return <SharedError error={applicationError} />;

  const initialData = applicationData?.result?.[0] ?? undefined;

  return (
    <Container>
      {isEditMode && applicationLoading ? (
        <SharedLoading />
      ) : (
        <ApplicationsStarterContent
          isEditMode={isEditMode}
          applicationId={applicationId}
          applicationData={initialData}
        />
      )}
    </Container>
  );
};

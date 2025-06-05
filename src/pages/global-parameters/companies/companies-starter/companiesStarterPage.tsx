import React from 'react';
import { Container } from '@/components';
import { CompaniesStarterContent } from '@/pages/global-parameters/companies/companies-starter/components/companiesStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getGlobalParameters } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const CompaniesStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: parameterData,
    isLoading: parameterLoading,
    isError: parameterIsError,
    error: parameterError
  } = useQuery({
    queryKey: ['global-parameter', id],
    queryFn: () => getGlobalParameters({ id: id ? parseInt(id) : undefined }),
    enabled: isEditMode,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  if (isEditMode && parameterIsError) {
    return <SharedError error={parameterError} />;
  }

  return (
    <Container>
      {isEditMode && parameterLoading ? (
        <SharedLoading />
      ) : (
        <CompaniesStarterContent
          parameterData={parameterData?.result[0]}
          isEditMode={isEditMode}
          parameterId={Number(id)}
        />
      )}
    </Container>
  );
};

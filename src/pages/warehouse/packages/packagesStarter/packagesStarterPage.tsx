import React from 'react';
import { Container } from '@/components';
import { PackageStarterContent } from '@/pages/warehouse/packages/packagesStarter/components/packageStarterContent.tsx';
import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/api';
import { useParams } from 'react-router';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const PackagesStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: packageData,
    isLoading: packageLoading,
    isError: packageIsError,
    error: packageError
  } = useQuery({
    queryKey: ['package', id],
    queryFn: () => getPackages({ id: id ? parseInt(id) : undefined }),
    enabled: isEditMode
  });

  if (isEditMode && packageIsError) {
    return <SharedError error={packageError} />;
  }

  return (
    <Container>
      {isEditMode && packageLoading ? (
        <SharedLoading />
      ) : (
        <PackageStarterContent
          isEditMode={isEditMode}
          packageId={Number(id)}
          packageData={packageData?.result[0]}
        />
      )}
    </Container>
  );
};

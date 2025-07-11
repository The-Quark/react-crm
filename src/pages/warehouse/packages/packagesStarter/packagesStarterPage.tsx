import React from 'react';
import { Container } from '@/components';
import { PackageStarterContent } from '@/pages/warehouse/packages/packagesStarter/components/packageStarterContent.tsx';
import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/api';
import { useParams } from 'react-router';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

export const PackagesStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();
  const isEditMode = !!id;
  const packageId = id ? parseInt(id, 10) : undefined;

  const {
    data: packageData,
    isLoading: packageLoading,
    isError: packageIsError,
    error: packageError
  } = useQuery({
    queryKey: ['package', id],
    queryFn: () => getPackages({ id: packageId }),
    enabled: isEditMode
  });

  if (isEditMode && (packageId === undefined || isNaN(packageId))) {
    return <SharedError error={new Error(formatMessage({ id: 'SYSTEM.ERROR.INVALID_ID' }))} />;
  }

  if (isEditMode && packageIsError) {
    return <SharedError error={packageError} />;
  }

  const initialData = packageData?.result?.[0] ?? undefined;

  return (
    <Container>
      {isEditMode && packageLoading ? (
        <SharedLoading />
      ) : (
        <PackageStarterContent
          isEditMode={isEditMode}
          packageId={packageId}
          packageData={initialData}
        />
      )}
    </Container>
  );
};

import React from 'react';
import { Container } from '@/components';
import { CargoStarterContent } from '@/pages/warehouse/cargo/cargoStarter/components/cargoStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getCargo } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

export const CargoStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();
  const isEditMode = !!id;
  const cargoId = id ? parseInt(id, 10) : undefined;

  const {
    data: cargoData,
    isLoading: cargoLoading,
    isError: cargoIsError,
    error: cargoError
  } = useQuery({
    queryKey: ['cargoID', id],
    queryFn: () => getCargo({ id: cargoId }),
    enabled: isEditMode
  });

  if (isEditMode && (cargoId === undefined || isNaN(cargoId))) {
    return <SharedError error={new Error(formatMessage({ id: 'SYSTEM.ERROR.INVALID_ID' }))} />;
  }

  if (isEditMode && cargoIsError) {
    return <SharedError error={cargoError} />;
  }

  const initialData = cargoData?.result?.[0] ?? undefined;

  return (
    <Container>
      {isEditMode && cargoLoading ? (
        <SharedLoading />
      ) : (
        <CargoStarterContent isEditMode={isEditMode} cargoId={Number(id)} cargoData={initialData} />
      )}
    </Container>
  );
};

import React from 'react';
import { Container } from '@/components';
import { CargoStarterContent } from '@/pages/warehouse/cargo/cargoStarter/components/cargoStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getCargo } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const CargoStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: cargoData,
    isLoading: cargoLoading,
    isError: cargoIsError,
    error: cargoError
  } = useQuery({
    queryKey: ['cargoID', id],
    queryFn: () => getCargo({ id: id ? parseInt(id) : undefined }),
    enabled: isEditMode
  });

  if (isEditMode && cargoIsError) {
    return <SharedError error={cargoError} />;
  }

  return (
    <Container>
      {isEditMode && cargoLoading ? (
        <SharedLoading />
      ) : (
        <CargoStarterContent
          isEditMode={isEditMode}
          cargoId={Number(id)}
          cargoData={cargoData?.result[0]}
        />
      )}
    </Container>
  );
};

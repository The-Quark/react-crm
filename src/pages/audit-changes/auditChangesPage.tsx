import React from 'react';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAuditLog } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const AuditChangesPage = () => {
  const { entity_type, entity_id } = useParams<{
    entity_type: string;
    entity_id: string;
  }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['audit_changes_id', entity_type, entity_id],
    queryFn: () =>
      getAuditLog({
        entity_id: Number(entity_id),
        entity_type: entity_type as 'Application' | 'Order' | 'Package' | 'Cargo'
      })
  });

  if (isLoading) {
    return <SharedLoading />;
  }

  if (isError) {
    return <SharedError error={error} />;
  }
  return <Container>qwerty</Container>;
};

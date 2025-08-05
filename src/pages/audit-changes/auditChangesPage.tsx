import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAuditLog } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { AuditChangesContent } from '@/pages/audit-changes/components/auditChangesContent.tsx';

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
    return <SharedLoading simple />;
  }

  if (isError) {
    return <SharedError error={error} />;
  }
  return <AuditChangesContent logs={data?.result[0] ?? undefined} />;
};

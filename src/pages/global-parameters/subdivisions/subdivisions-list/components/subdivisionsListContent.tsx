/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getGlobalParamsSubdivisions } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useSubdivisionsColumns } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsColumns.tsx';
import { SubdivisionToolbar } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';

export const SubdivisionsListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['globalParamsSubdivisions', selectedCompanyId],
    queryFn: () => getGlobalParamsSubdivisions({ company_id: selectedCompanyId }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: selectedCompanyId !== undefined
  });

  const columns = useSubdivisionsColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data?.result}
        rowSelection={true}
        pagination={{ size: 15 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={
          <SubdivisionToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
          />
        }
        layout={{ card: true }}
        messages={{
          empty: isLoading && <SharedLoading simple />
        }}
      />
    </Container>
  );
};

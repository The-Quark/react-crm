/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParamsDepartments } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDepartmentsColumns } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsColumns.tsx';
import { DepartmentsToolbar } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';

export const DepartmentsListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['globalParamsDepartments', selectedCompanyId],
    queryFn: () => getGlobalParamsDepartments({ company_id: selectedCompanyId }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: selectedCompanyId !== undefined
  });

  const columns = useDepartmentsColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <div className="grid gap-5 lg:gap-7.5">
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={
            <DepartmentsToolbar
              initialCompanyId={initialCompanyId}
              onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
            />
          }
          layout={{ card: true }}
          messages={{
            empty: isLoading && <SharedLoading simple />
          }}
        />
      </div>
    </Container>
  );
};

/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParamsDepartments } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDepartmentsColumns } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsColumns.tsx';
import { DepartmentsToolbar } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsToolbar.tsx';

export const DepartmentsListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['globalParamsDepartments'],
    queryFn: () => getGlobalParamsDepartments(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
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
          toolbar={<DepartmentsToolbar />}
          layout={{ card: true }}
          messages={{
            empty: isLoading && <SharedLoading simple />
          }}
        />
      </div>
    </Container>
  );
};

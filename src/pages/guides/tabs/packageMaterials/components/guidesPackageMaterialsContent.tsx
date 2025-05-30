/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getPackageMaterials } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { usePackageMaterialsColumns } from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsColumns.tsx';
import { PackageMaterialsToolbar } from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsToolbar.tsx';

export const GuidesPackageMaterialsContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['packageMaterials'],
    queryFn: () => getPackageMaterials(),
    staleTime: 1000 * 60 * 60
  });
  const columns = usePackageMaterialsColumns();

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
        toolbar={<PackageMaterialsToolbar />}
        layout={{ card: true }}
        messages={{
          empty: isLoading && <SharedLoading simple />
        }}
      />
    </Container>
  );
};

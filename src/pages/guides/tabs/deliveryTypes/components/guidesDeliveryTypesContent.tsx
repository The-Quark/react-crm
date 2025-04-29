/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getDeliveryTypes } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { useDeliveryTypesColumns } from '@/pages/guides/tabs/deliveryTypes/components/blocks/deliveryTypesColumns.tsx';
import { DeliveryTypesToolbar } from '@/pages/guides/tabs/deliveryTypes/components/blocks/deliveryTypesToolbar.tsx';

export const GuidesDeliveryTypesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['deliveryTypes'],
    queryFn: () => getDeliveryTypes()
  });
  const columns = useDeliveryTypesColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<DeliveryTypesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};

/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useState } from 'react';
import { usePackagesColumns } from '@/pages/call-center/packages/packagesList/components/blocks/packagesColumns.tsx';
import { PackagesToolbar } from '@/pages/call-center/packages/packagesList/components/blocks/packagesToolbar.tsx';
import { PackagesModal } from '@/pages/call-center/packages/packagesList/components/blocks/packagesModal.tsx';

export const PackagesListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['packages'],
    queryFn: () => getPackages(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = usePackagesColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  });

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
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<PackagesToolbar />}
          layout={{ card: true }}
        />
      )}
      <PackagesModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
    </Container>
  );
};

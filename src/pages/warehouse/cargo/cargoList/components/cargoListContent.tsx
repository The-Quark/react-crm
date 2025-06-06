/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getCargo } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useState } from 'react';
import { CargoToolbar } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoToolbar.tsx';
import { useCargoColumns } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoColumns.tsx';
import { CargoModal } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoModal.tsx';

export const CargoListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['cargo', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getCargo({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useCargoColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  });

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        layout={{ card: true }}
        data={data?.result || []}
        onFetchData={handleFetchData}
        toolbar={<CargoToolbar onSearch={handleSearch} />}
        pagination={{
          page: pagination.pageIndex,
          size: pagination.pageSize,
          total: data?.total || 0
        }}
        messages={{
          empty: isPending && <SharedLoading simple />,
          loading: isFetching && <SharedLoading simple />
        }}
      />
      <CargoModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
    </Container>
  );
};

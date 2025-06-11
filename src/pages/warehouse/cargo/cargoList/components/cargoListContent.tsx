/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getCargo } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useState } from 'react';
import { CargoToolbar } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoToolbar.tsx';
import { useCargoColumns } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoColumns.tsx';
import { CargoModal } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoModal.tsx';
import { CargoStatus } from '@/api/enums';

export const CargoListContent = () => {
  const [searchTermCode, setSearchTermCode] = useState('');
  const [searchTermPackage, setSearchTermPackage] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const [status, setStatus] = useState<CargoStatus>();
  const [deliveryCategory, setDeliveryCategory] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'cargo',
      pagination.pageIndex,
      pagination.pageSize,
      searchTermCode,
      searchTermPackage,
      status,
      deliveryCategory
    ],
    queryFn: () =>
      getCargo({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        code: searchTermCode,
        hawb: searchTermPackage,
        delivery_category: deliveryCategory,
        status: status
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

  const handleSearchCode = (term: string) => {
    setSearchTermCode(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleStatusChange = (newStatus: CargoStatus | undefined) => {
    setStatus(newStatus);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleSearchPackage = (term: string) => {
    setSearchTermPackage(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleDeliveryCategoryChange = (newCategory: string | undefined) => {
    setDeliveryCategory(newCategory);
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
        toolbar={
          <CargoToolbar
            onSearchCode={handleSearchCode}
            onSearchPackage={handleSearchPackage}
            currentStatus={status}
            onStatusChange={handleStatusChange}
            currentDeliveryCategory={deliveryCategory}
            onDeliveryCategoryChange={handleDeliveryCategoryChange}
          />
        }
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

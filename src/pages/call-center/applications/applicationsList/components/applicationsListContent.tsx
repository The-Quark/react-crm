/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useApplicationsColumns } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsColumns.tsx';
import { ApplicationsToolbar } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsToolbar.tsx';
import { useState } from 'react';
import { ApplicationsModal } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsModal.tsx';
import { ApplicationsStatus } from '@/api/enums';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export const ApplicationListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<ApplicationsStatus>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'applications',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      status,
      dateRange
    ],
    queryFn: () =>
      getApplications({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        full_name: searchTerm,
        status: status,
        start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useApplicationsColumns({
    onRowClick: (id) => {
      setSelectedApplicationId(id);
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

  const handleStatusChange = (newStatus: ApplicationsStatus | undefined) => {
    setStatus(newStatus);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
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
        data={data?.result || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <ApplicationsToolbar
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
            onDateRangeChange={handleDateRangeChange}
            currentStatus={status}
            currentDateRange={dateRange}
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
      <ApplicationsModal
        open={isModalOpen}
        id={selectedApplicationId}
        handleClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

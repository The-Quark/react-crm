import { DataGrid } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { Container } from '@/components/container';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { initialPagination } from '@/utils';
import { LogLevel } from '@/pages/admin-logs/components/mockTypes.ts';
import { useAdminLogsColumns } from '@/pages/admin-logs/components/blocks/adminLogsColumns.tsx';
import { AdminLogsToolbar } from '@/pages/admin-logs/components/blocks/adminLogsToolbar.tsx';
import { mockLogs } from '@/pages/admin-logs/components/mockData.tsx';

export const AdminLogsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<LogLevel>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [pagination, setPagination] = useState(initialPagination);

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
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        full_name: searchTerm,
        status: status,
        start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
      })
  });

  const columns = useAdminLogsColumns();

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(initialPagination);
  };

  const handleStatusChange = (newStatus: LogLevel | undefined) => {
    setStatus(newStatus);
    setPagination(initialPagination);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPagination(initialPagination);
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={mockLogs || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <AdminLogsToolbar
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
    </Container>
  );
};

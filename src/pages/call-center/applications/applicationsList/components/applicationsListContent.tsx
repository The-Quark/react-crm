import { useIntl } from 'react-intl';
import { Container, DataGrid } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteApplication, getApplications } from '@/api';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { useApplicationsColumns } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsColumns.tsx';
import { ApplicationsToolbar } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsToolbar.tsx';
import { useState } from 'react';
import { ApplicationsModal } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsModal.tsx';
import { ApplicationsStatus } from '@/api/enums';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { initialPagination } from '@/utils';

export const ApplicationListContent = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<ApplicationsStatus>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
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

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteApplication(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useApplicationsColumns({
    onRowClick: (id) => {
      setSelectedApplicationId(id);
      setIsModalOpen(true);
    },
    onDeleteClick: handleDeleteClick
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
    setPagination(initialPagination);
  };

  const handleStatusChange = (newStatus: ApplicationsStatus | undefined) => {
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
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={formatMessage({ id: 'SYSTEM.DELETE_APPLICATION' })}
        description={formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_APPLICATION_DESCRIPTION' })}
        isLoading={isDeleting}
      />
    </Container>
  );
};

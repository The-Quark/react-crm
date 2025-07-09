import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SubdivisionModal } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsModal.tsx';
import { useQuery } from '@tanstack/react-query';
import { getGlobalParameters } from '@/api';
import { SharedAutocompleteBase, SharedError } from '@/partials/sharedUI';
import { debounce } from '@/utils/lib/helpers.ts';
import { useIntl } from 'react-intl';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface Props {
  initialCompanyId?: number;
  onCompanyChange: (companyId: number | null) => void;
  onSearch?: (searchTerm: string) => void;
}

export const SubdivisionToolbar: FC<Props> = ({ initialCompanyId, onCompanyChange, onSearch }) => {
  const { table } = useDataGrid();
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchValue, setSearchValue] = useState('');

  const canManageGlobalSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const isSuperAdmin = currentUser?.roles[0].name === 'superadmin';
  const isViewer = currentUser?.roles[0].name === 'viewer';

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('SUBDIVISION')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['globalParamsCompany'],
    queryFn: () => getGlobalParameters(),
    enabled: isViewer || isSuperAdmin
  });

  const handleCompanyChange = (val: number) => {
    setSelectedCompanyId(val);
    onCompanyChange(val);
  };

  if (companyIsError) {
    return <SharedError error={companyError} />;
  }

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.SUBDIVISIONS' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            {formatMessage({ id: 'SYSTEM.NEW_SUBDIVISION' })}
          </button>
        )}
        {(isViewer || isSuperAdmin) && (
          <div className="w-64">
            <SharedAutocompleteBase
              value={selectedCompanyId ?? ''}
              options={
                companyData?.result.map((item) => ({
                  id: item.id,
                  name: item.company_name
                })) ?? []
              }
              placeholder={formatMessage({ id: 'SYSTEM.SELECT_COMPANY' })}
              searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COMPANY' })}
              onChange={handleCompanyChange}
              onSearchTermChange={setSearchCompanyTerm}
              searchTerm={searchCompanyTerm}
              loading={companyLoading}
              size="sm"
            />
          </div>
        )}
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_SUBDIVISION' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <SubdivisionModal open={modalOpen} onOpenChange={handleClose} />
    </div>
  );
};

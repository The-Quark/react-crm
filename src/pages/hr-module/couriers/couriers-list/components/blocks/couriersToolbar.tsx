import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { getGlobalParameters } from '@/api';
import { SharedAutocompleteBase, SharedError } from '@/partials/sharedUI';
import { debounce } from '@/utils/lib/helpers.ts';
import { useIntl } from 'react-intl';

interface Props {
  initialCompanyId?: number;
  onCompanyChange: (companyId: number | null) => void;
  onSearch?: (searchTerm: string) => void;
}

export const CouriersToolbar: FC<Props> = ({ initialCompanyId, onCompanyChange, onSearch }) => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { formatMessage } = useIntl();
  const { has } = useUserPermissions();
  const canManageSettings = has('manage users') || currentUser?.roles[0].name === 'superadmin';
  const isSuperAdmin = currentUser?.roles[0].name === 'superadmin';
  const isViewer = currentUser?.roles[0].name === 'viewer';
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchValue, setSearchValue] = useState('');

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['hrModuleCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: 1000 * 60 * 5,
    enabled: isViewer || isSuperAdmin
  });

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('title')?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleCompanyChange = (val: number) => {
    setSelectedCompanyId(val);
    onCompanyChange(val);
  };

  if (companyIsError) {
    return <SharedError error={companyError} />;
  }

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.COURIERS' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageSettings && (
          <a href="/hr-module/couriers/starter" className="btn btn-sm btn-primary">
            {formatMessage({ id: 'SYSTEM.NEW_COURIER' })}
          </a>
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_COURIER' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

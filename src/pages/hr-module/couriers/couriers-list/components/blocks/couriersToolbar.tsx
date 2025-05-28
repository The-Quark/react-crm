import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { getGlobalParameters } from '@/api';
import { SharedAutocompleteBase, SharedError } from '@/partials/sharedUI';

interface Props {
  initialCompanyId?: number;
  onCompanyChange: (companyId: number | null) => void;
}

export const CouriersToolbar: FC<Props> = ({ initialCompanyId, onCompanyChange }) => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSettings = has('manage users') || currentUser?.roles[0].name === 'superadmin';
  const isSuperAdmin = currentUser?.roles[0].name === 'superadmin';
  const isViewer = currentUser?.roles[0].name === 'viewer';
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);

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

  const handleCompanyChange = (val: number) => {
    setSelectedCompanyId(val);
    onCompanyChange(val);
  };

  if (companyIsError) {
    return <SharedError error={companyError} />;
  }

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Couriers</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageSettings && (
          <a href="/hr-module/couriers/starter" className="btn btn-sm btn-primary">
            New courier
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
              placeholder="Select company"
              searchPlaceholder="Search company"
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
            placeholder="Search courier"
            className="input input-sm ps-8"
            value={(table.getColumn('courier')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('courier')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

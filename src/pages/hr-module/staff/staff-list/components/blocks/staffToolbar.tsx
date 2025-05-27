import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { getGlobalParameters } from '@/api';
import { SharedAutocomplete } from '@/partials/sharedUI';

interface Props {
  onCompanyChange: (companyId: number | null) => void;
}

export const StaffToolbar: FC<Props> = ({ onCompanyChange }) => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSettings = has('manage users') || currentUser?.roles[0].name === 'superadmin';
  const isSuperAdmin = currentUser?.roles[0].name === 'superadmin';
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const storageHiddenColumnsId = 'staff-hidden-columns';

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['staffCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: 1000 * 60 * 2
  });

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Staff</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageSettings && (
          <a href="/hr-module/staff/starter" className="btn btn-sm btn-primary">
            New staff
          </a>
        )}
        {isSuperAdmin && (
          <SharedAutocomplete
            label="Company"
            value={currentUser?.company_id ? Number(currentUser.company_id) : ''}
            options={
              companyData?.result.map((item) => ({
                ...item,
                name: item.company_name,
                value: item.id
              })) ?? []
            }
            placeholder="Select company"
            searchPlaceholder="Search company"
            onChange={(val) => {
              onCompanyChange(val ? Number(val) : null);
            }}
            searchTerm={searchCompanyTerm}
            onSearchTermChange={setSearchCompanyTerm}
          />
        )}
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search staff"
            className="input input-sm ps-8"
            value={(table.getColumn('staff')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('staff')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

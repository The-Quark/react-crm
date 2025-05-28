import React from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

export const CompaniesToolbar = () => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Companies</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/global-parameters/starter-parameters" className="btn btn-sm btn-primary">
            New company
          </a>
        )}
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search company"
            className="input input-sm ps-8"
            value={(table.getColumn('company name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('company name')?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

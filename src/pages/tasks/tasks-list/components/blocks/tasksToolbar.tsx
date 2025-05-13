import React from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

export const TasksToolbar = () => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage tasks') || currentUser?.roles[0].name === 'superadmin';
  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Tasks</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/tasks/starter" className="btn btn-sm btn-primary">
            New task
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
            placeholder="Search title"
            className="input input-sm ps-8"
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

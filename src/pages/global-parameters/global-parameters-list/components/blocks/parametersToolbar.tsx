import React from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';

export const ParametersToolbar = () => {
  const { table } = useDataGrid();
  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Parameters</h3>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search Company"
            className="input input-sm ps-8"
            value={(table.getColumn('company name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('company name')?.setFilterValue(event.target.value)
            }
          />
        </div>
        <DataGridColumnVisibility table={table} />
      </div>
    </div>
  );
};

import React from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';

export const LanguagesToolbar = () => {
  const { table } = useDataGrid();

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Languages</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search language"
            className="input input-sm ps-8"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          />
        </div>
        <DataGridColumnVisibility table={table} />
      </div>
    </div>
  );
};

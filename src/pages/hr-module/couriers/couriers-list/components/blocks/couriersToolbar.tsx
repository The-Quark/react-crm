import React, { FC } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';

export const CouriersToolbar: FC = () => {
  const { table } = useDataGrid();
  const storageHiddenColumnsId = 'couriers-hidden-columns';
  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Couriers</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <a href="/hr-module/couriers/starter" className="btn btn-sm btn-primary">
          New courier
        </a>
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

import React, { FC } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { cargoStatusOptions } from '@/lib/mocks.ts';

export const CargoToolbar: FC = () => {
  const { table } = useDataGrid();

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Cargo</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {/*search by id search by client full name select status date created time*/}
        <a href="/call-center/cargo/starter" className="btn btn-sm btn-primary">
          New Cargo
        </a>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) => {
            table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value);
          }}
        >
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {cargoStatusOptions.map((status) => (
              <SelectItem key={status.id} value={status.value}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search client"
            className="input input-sm ps-8"
            value={(table.getColumn('client full name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('client full name')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

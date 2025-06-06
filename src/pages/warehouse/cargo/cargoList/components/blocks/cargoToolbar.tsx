import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { cargoStatusOptions } from '@/lib/mocks.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/lib/helpers.ts';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
}

export const CargoToolbar: FC<ToolbarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

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

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Cargo</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/warehouse/cargo/starter" className="btn btn-sm btn-primary">
            New Cargo
          </a>
        )}
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
            placeholder="Search mawb"
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { mockDeliveryCategories, packageStatusOptions } from '@/utils/enumsOptions/mocks.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { PackageStatus } from '@/api/enums';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
  onStatusChange?: (status: PackageStatus | undefined) => void;
  currentStatus?: PackageStatus;
  onDeliveryCategoryChange?: (status: string | undefined) => void;
  currentDeliveryCategory?: string;
}

export const PackagesToolbar: FC<ToolbarProps> = ({
  onSearch,
  currentStatus,
  onStatusChange,
  currentDeliveryCategory,
  onDeliveryCategoryChange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('hawb')?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : (value as PackageStatus);

    table.getColumn('status')?.setFilterValue(newStatus || '');
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const handleDeliveryTypeChange = (value: string) => {
    const newCategory = value === 'all' ? undefined : (value as string);

    table.getColumn('delivery category')?.setFilterValue(newCategory || '');
    if (onDeliveryCategoryChange) {
      onDeliveryCategoryChange(newCategory);
    }
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Packages</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/warehouse/packages/starter" className="btn btn-sm btn-primary">
            New Package
          </a>
        )}
        <Select value={currentDeliveryCategory || 'all'} onValueChange={handleDeliveryTypeChange}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {mockDeliveryCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={currentStatus || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {packageStatusOptions.map((status) => (
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
            placeholder="Search hawb"
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

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
import { useIntl } from 'react-intl';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
  onStatusChange?: (status: PackageStatus | undefined) => void;
  currentStatus?: PackageStatus;
  onDeliveryCategoryChange?: (status: string | undefined) => void;
  currentDeliveryCategory?: string;
  onCreateCargo?: () => void;
}

export const PackagesToolbar: FC<ToolbarProps> = ({
  onSearch,
  currentStatus,
  onStatusChange,
  currentDeliveryCategory,
  onDeliveryCategoryChange,
  onCreateCargo
}) => {
  const { formatMessage } = useIntl();
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const [searchValue, setSearchValue] = useState('');

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('HAWB')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : (value as PackageStatus);

    table.getColumn('STATUS')?.setFilterValue(newStatus || '');
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const handleDeliveryTypeChange = (value: string) => {
    const newCategory = value === 'all' ? undefined : (value as string);

    table.getColumn('DELIVERY_CATEGORY')?.setFilterValue(newCategory || '');
    if (onDeliveryCategoryChange) {
      onDeliveryCategoryChange(newCategory);
    }
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.PACKAGES' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <>
            <button type="button" className="btn btn-sm btn-primary" onClick={onCreateCargo}>
              <KeenIcon icon="delivery" /> {formatMessage({ id: 'SYSTEM.COLLECT_CARGO' })}
            </button>
            <a href="/warehouse/packages/starter" className="btn btn-sm btn-primary">
              {formatMessage({ id: 'SYSTEM.NEW_PACKAGE' })}
            </a>
          </>
        )}
        <Select value={currentDeliveryCategory || 'all'} onValueChange={handleDeliveryTypeChange}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder={formatMessage({ id: 'SYSTEM.SELECT_CATEGORY' })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{formatMessage({ id: 'SYSTEM.ALL_CATEGORIES' })}</SelectItem>
            {mockDeliveryCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {formatMessage({ id: category.name })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={currentStatus || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder={formatMessage({ id: 'SYSTEM.SELECT_STATUS' })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{formatMessage({ id: 'SYSTEM.ALL_STATUSES' })}</SelectItem>
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_HAWB' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

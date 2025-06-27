import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { cargoStatusOptions, mockDeliveryCategories } from '@/utils/enumsOptions/mocks.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { CargoStatus } from '@/api/enums';
import { useIntl } from 'react-intl';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface ToolbarProps {
  onSearchCode?: (searchTerm: string) => void;
  onSearchPackage?: (searchTerm: string) => void;
  onStatusChange?: (status: CargoStatus | undefined) => void;
  currentStatus?: CargoStatus;
  onDeliveryCategoryChange?: (status: string | undefined) => void;
  currentDeliveryCategory?: string;
}

export const CargoToolbar: FC<ToolbarProps> = ({
  onSearchCode,
  onSearchPackage,
  currentDeliveryCategory,
  onDeliveryCategoryChange,
  currentStatus,
  onStatusChange
}) => {
  const { table } = useDataGrid();
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const [searchValueCode, setSearchValueCode] = useState('');
  const [searchValuePackage, setSearchValuePackage] = useState('');

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const debouncedSearchCode = debounce((value: string) => {
    if (onSearchCode) {
      onSearchCode(value);
    }
    table.getColumn('code')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValueCode(value);
    debouncedSearchCode(value);
  };

  const debouncedSearchPackage = debounce((value: string) => {
    if (onSearchPackage) {
      onSearchPackage(value);
    }
    table.getColumn('hawb')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChangePackage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValuePackage(value);
    debouncedSearchPackage(value);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : (value as CargoStatus);

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
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.CARGO' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/warehouse/cargo/starter" className="btn btn-sm btn-primary">
            {formatMessage({ id: 'SYSTEM.NEW_CARGO' })}
          </a>
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_MAWB' })}
            className="input input-sm ps-8"
            value={searchValueCode}
            onChange={handleSearchChangeCode}
          />
        </div>
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_HAWB' })}
            className="input input-sm ps-8"
            value={searchValuePackage}
            onChange={handleSearchChangePackage}
          />
        </div>
      </div>
    </div>
  );
};

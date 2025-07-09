import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { mockDeliveryCategories, mockOrdersStatus } from '@/utils/enumsOptions/mocks.ts';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/utils/lib/utils.ts';
import { Calendar } from '@/components/ui/calendar.tsx';
import { useIntl } from 'react-intl';
import { debounce } from '@/utils/lib/helpers.ts';
import { OrderStatus } from '@/api/enums';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
  onStatus?: (status: string | undefined) => void;
  onDeliveryCategory?: (delivery_category: string | undefined) => void;
  currentStatus?: string;
  currentDeliveryCategory?: string;
  currentDateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export const MyDraftsToolbar: FC<ToolbarProps> = ({
  onSearch,
  onDeliveryCategory,
  onStatus,
  currentStatus,
  currentDeliveryCategory,
  onDateRangeChange,
  currentDateRange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { formatMessage } = useIntl();
  const { table } = useDataGrid();

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('CODE')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : (value as OrderStatus);

    table.getColumn('STATUS')?.setFilterValue(newStatus || '');
    if (onStatus) {
      onStatus(newStatus);
    }
  };

  const handleDeliveryCategoryChange = (value: string) => {
    const newDeliveryType = value === 'all' ? undefined : value;

    table.getColumn('CATEGORY')?.setFilterValue(newDeliveryType || '');
    if (onDeliveryCategory) {
      onDeliveryCategory(newDeliveryType);
    }
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
    table.getColumn('CREATED_AT')?.setFilterValue(range);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.DRAFTS' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          value={currentDeliveryCategory || 'all'}
          onValueChange={handleDeliveryCategoryChange}
        >
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
            {mockOrdersStatus.map((status) => (
              <SelectItem key={status.id} value={status.value}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <button
              id="date"
              className={cn(
                'btn btn-sm btn-light data-[state=open]:bg-light-active',
                !currentDateRange && 'text-gray-400'
              )}
            >
              <KeenIcon icon="calendar" className="me-0.5" />
              {currentDateRange?.from ? (
                currentDateRange.to ? (
                  <>
                    {format(currentDateRange.from, 'LLL dd, y')} -{' '}
                    {format(currentDateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(currentDateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>{formatMessage({ id: 'SYSTEM.PICK_DATE_RANGE' })}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={currentDateRange?.from}
              selected={currentDateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_ORDER' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

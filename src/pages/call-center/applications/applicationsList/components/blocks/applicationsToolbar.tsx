import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { mockApplicationsStatus } from '@/lib/mocks.ts';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { Calendar } from '@/components/ui/calendar.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/lib/helpers.ts';
import { ApplicationsStatus } from '@/api/enums';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
  onStatusChange?: (status: ApplicationsStatus | undefined) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  currentStatus?: ApplicationsStatus;
  currentDateRange?: DateRange;
}

export const ApplicationsToolbar: FC<ToolbarProps> = ({
  onSearch,
  currentStatus,
  onStatusChange,
  onDateRangeChange,
  currentDateRange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';

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

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : (value as ApplicationsStatus);

    table.getColumn('status')?.setFilterValue(newStatus || '');
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
    table.getColumn('created at')?.setFilterValue(range);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Applications</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/call-center/applications/starter" className="btn btn-sm btn-primary">
            New application
          </a>
        )}
        <Select value={currentStatus || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {mockApplicationsStatus.map((status) => (
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
                <span>Pick a date range</span>
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
          {/*search by id search by client full name select status date created time*/}
          <input
            type="text"
            placeholder="Search application"
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
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

export const ApplicationsToolbar: FC = () => {
  const { table } = useDataGrid();
  const date = table.getColumn('created at')?.getFilterValue() as DateRange | undefined;
  const handleDateChange = (range: DateRange | undefined) => {
    table.getColumn('created at')?.setFilterValue(range);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Applications</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <a href="/call-center/applications/starter" className="btn btn-sm btn-primary">
          New application
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
                !date && 'text-gray-400'
              )}
            >
              <KeenIcon icon="calendar" className="me-0.5" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
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
              defaultMonth={date?.from}
              selected={date}
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
            value={(table.getColumn('full name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('full name')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

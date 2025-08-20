import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { DateRange } from 'react-day-picker';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';
import { filterDateRange } from '@/utils';
import { LogEntry } from '@/pages/admin-logs/components/mockTypes.ts';

export const useAdminLogsColumns = (): ColumnDef<LogEntry>[] => {
  const { formatMessage } = useIntl();
  const { isRTL } = useLanguage();

  const columns = useMemo<ColumnDef<LogEntry>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'ID',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.ID' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5 ">
            <div className="leading-none text-gray-800 font-normal ">{info.row.original.id}</div>
          </div>
        ),
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.source,
        id: 'SOURCE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.SOURCE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <SharedStatusBadge status={info.row.original.source} />
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.message,
        id: 'MESSAGE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.MESSAGE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="leading-none font-medium text-sm text-gray-700 ">
            {info.row.original?.message}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row?.trace,
        id: 'TRACE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.TRACE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          return (
            <div className="flex flex-col gap-0.5">
              <div className="leading-none font-medium text-sm text-gray-700 ">
                {info.row.original?.trace}
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.level,
        id: 'STATUS',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.STATUS' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedStatusBadge status={info.row.original.level} />
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row?.ts,
        id: 'TIME',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.TIME' })} column={column} />
        ),
        enableSorting: false,
        filterFn: (row, columnId, filterValue: DateRange) =>
          filterDateRange(row.getValue(columnId), filterValue),
        cell: (info) => {
          const date = new Date(info.row.original.ts);
          const formattedDate = date.toLocaleDateString('ru-RU');

          return (
            <div className="flex items-center gap-1.5">
              <div className="leading-none text-gray-800 font-normal">{formattedDate}</div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      }
    ],
    [isRTL]
  );
  return columns;
};

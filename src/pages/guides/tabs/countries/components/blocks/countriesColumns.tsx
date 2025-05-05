import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { Country } from '@/api/get/getCountries/types.ts';

export const useCountriesColumns = (): ColumnDef<Country>[] => {
  const { isRTL } = useLanguage();
  const columns = useMemo<ColumnDef<Country>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        enableSorting: true,
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
        accessorFn: (row) => row.name,
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Country" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.name}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.iso2,
        id: 'iso2',
        header: ({ column }) => <DataGridColumnHeader title="ISO" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.iso2}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.phone_code,
        id: 'phone code',
        header: ({ column }) => <DataGridColumnHeader title="Phone code" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.phone_code}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.currency.name,
        id: 'currency',
        header: ({ column }) => <DataGridColumnHeader title="Currency" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.currency.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.timezones,
        id: 'timezones',
        header: ({ column }) => <DataGridColumnHeader title="Timezones" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const timezones = info.row.original.timezones;
          const visible = timezones
            .slice(0, 2)
            .map((tz) => tz.name)
            .join(', ');
          const extra = timezones.length > 2 ? ` +${timezones.length - 2} more` : '';

          return (
            <div className="flex items-center gap-1.5">
              <div className="leading-none text-gray-800 font-normal truncate">
                {visible}
                {extra}
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      }
    ],
    [isRTL]
  );
  return columns;
};

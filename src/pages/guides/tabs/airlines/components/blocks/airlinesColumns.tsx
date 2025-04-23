import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components';
import { useLanguage } from '@/providers';
import { Airline } from '@/api/get/getAirlines/types.ts';
import { AirlinesMenuOptions } from '@/pages/guides/tabs/airlines/components/blocks/airlinesMenuOptions.tsx';

interface Props {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAirlinesColumns = ({ setReload }: Props): ColumnDef<Airline>[] => {
  const { isRTL } = useLanguage();
  const columnsAirline = useMemo<ColumnDef<Airline>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.id,
        id: 'airline id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">{info.row.original.id}</span>
          </div>
        ),
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Airline" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <a href="#" className="leading-none text-gray-800 font-normal">
                {info.row.original.name}
              </a>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.code,
        id: 'code',
        header: ({ column }) => <DataGridColumnHeader title="Code" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">{info.row.original.code}</span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.country,
        id: 'country',
        header: ({ column }) => <DataGridColumnHeader title="Country" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.country}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.is_active,
        id: 'active',
        header: ({ column }) => <DataGridColumnHeader title="Active" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.is_active ? 'Yes' : 'No'}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: (info) =>
          AirlinesMenuOptions({
            id: info.row.original.id,
            handleReload: () => setReload((prev) => !prev)
          }),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL]
  );
  return columnsAirline;
};

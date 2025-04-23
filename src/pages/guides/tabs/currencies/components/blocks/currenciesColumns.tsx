import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components';
import { useLanguage } from '@/providers';
import { Currency } from '@/api/get/getCurrencies/types.ts';
import { CurrenciesMenuOptions } from '@/pages/guides/tabs/currencies/components/blocks/currenciesMenuOptions.tsx';
interface Props {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCurrenciesColumns = ({ setReload }: Props): ColumnDef<Currency>[] => {
  const { isRTL } = useLanguage();
  const columnsCurrency = useMemo<ColumnDef<Currency>[]>(
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
        id: 'currency id',
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
        id: 'currency name',
        header: ({ column }) => <DataGridColumnHeader title="Currency" column={column} />,
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
        accessorFn: (row) => row.symbol,
        id: 'currency symbol',
        header: ({ column }) => <DataGridColumnHeader title="Symbol" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <div className="leading-none text-gray-800 font-normal">
                {info.row.original.symbol}
              </div>
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
        id: 'currency code',
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
        accessorFn: (row) => row.is_base,
        id: 'is base',
        header: ({ column }) => <DataGridColumnHeader title="Base" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.is_base ? 'Yes' : 'No'}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.rate_to_base,
        id: 'rate to base',
        header: ({ column }) => <DataGridColumnHeader title="Rate to base" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.rate_to_base}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
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
          CurrenciesMenuOptions({
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
  return columnsCurrency;
};

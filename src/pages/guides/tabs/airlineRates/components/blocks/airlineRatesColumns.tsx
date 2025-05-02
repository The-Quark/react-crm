import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { AirlineRate } from '@/api/get/getAirlineRates/types.ts';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deleteAirlineRate } from '@/api';
import { AirlineRatesModal } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesModal.tsx';

export const useAirlineRatesColumns = (): ColumnDef<AirlineRate>[] => {
  const { isRTL } = useLanguage();
  const columns = useMemo<ColumnDef<AirlineRate>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.id}</div>
          </div>
        ),
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.airline.name,
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Airline" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.airline.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.price_per_kg,
        id: 'price per kg',
        header: ({ column }) => <DataGridColumnHeader title="Price per kg" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.price_per_kg}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.from_city.name,
        id: 'from city',
        header: ({ column }) => <DataGridColumnHeader title="From city" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.from_city.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },

      {
        accessorFn: (row) => row.to_city.name,
        id: 'to city',
        header: ({ column }) => <DataGridColumnHeader title="To city" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.to_city.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.is_active,
        id: 'active',
        header: ({ column }) => <DataGridColumnHeader title="Active" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.is_active ? 'Yes' : 'No'}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
          <GuidesMenuOptions
            id={info.row.original.id}
            invalifateRequestKey="guidesAirlineRates"
            deleteRequest={deleteAirlineRate}
            renderModal={({ open, onOpenChange }) => (
              <AirlineRatesModal
                open={open}
                onOpenChange={() => onOpenChange(true)}
                id={info.row.original.id}
              />
            )}
          />
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL]
  );
  return columns;
};

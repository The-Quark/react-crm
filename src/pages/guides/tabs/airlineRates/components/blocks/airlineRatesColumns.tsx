import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { AirlineRate } from '@/api/get/getGuides/getAirlineRates/types.ts';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deleteAirlineRate } from '@/api';
import { AirlineRatesModal } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';

export const useAirlineRatesColumns = (): ColumnDef<AirlineRate>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<AirlineRate>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'ID',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.ID' })} column={column} />
        ),
        enableSorting: false,
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
        id: 'AIRLINE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.AIRLINE' })} column={column} />
        ),
        enableSorting: false,
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
        id: 'PRICE_PER_KG',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.PRICE_PER_KG' })}
            column={column}
          />
        ),
        enableSorting: false,
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
        id: 'FROM_CITY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.FROM_CITY' })} column={column} />
        ),
        enableSorting: false,
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
        id: 'TO_CITY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.TO_CITY' })} column={column} />
        ),
        enableSorting: false,
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
        id: 'ACTIVE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.ACTIVE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedStatusBadge status={info.row.original.is_active} />
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
            invalidateRequestKey="guidesAirlineRates"
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
  return canManage ? columns : columns.slice(0, -1);
};

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { Currency } from '@/api/get/getGuides/getCurrencies/types.ts';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deleteCurrency } from '@/api';
import CurrenciesModal from '@/pages/guides/tabs/currencies/components/blocks/currenciesModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';

export const useCurrenciesColumns = (): ColumnDef<Currency>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<Currency>[]>(
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
        accessorFn: (row) => row.name,
        id: 'CURRENCY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CURRENCY' })} column={column} />
        ),
        enableSorting: false,
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
        accessorFn: (row) => row.code,
        id: 'CODE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CODE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">{info.row.original.code}</span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.symbol,
        id: 'SYMBOL',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.SYMBOL' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.symbol}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.rate_to_base,
        id: 'RATE_TO_BASE',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.RATE_TO_BASE' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.rate_to_base}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.is_base,
        id: 'BASE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.BASE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedStatusBadge status={info.row.original.is_base} />
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
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
            invalidateRequestKey="guidesCurrencies"
            deleteRequest={deleteCurrency}
            renderModal={({ open, onOpenChange }) => (
              <CurrenciesModal
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

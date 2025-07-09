import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deleteTariff } from '@/api';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useIntl } from 'react-intl';
import { Tariff } from '@/api/get/getGuides/getTariffs/types.ts';
import TariffModal from '@/pages/guides/tabs/tariff/components/blocks/tariffModal.tsx';

export const useTariffColumns = (): ColumnDef<Tariff>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<Tariff>[]>(
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
        accessorFn: (row) => row.country.name,
        id: 'COUNTRY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.COUNTRY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.country.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.package_type?.code,
        id: 'PACKAGE_TYPE',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.PACKAGE_TYPE' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.package_type?.code}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.price,
        id: 'PRICE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.PRICE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.price}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.weight_from,
        id: 'WEIGHT_FROM',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.WEIGHT_FROM' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.weight_from}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.weight_to,
        id: 'WEIGHT_TO',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.WEIGHT_TO' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.weight_to}
            </span>
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
            invalidateRequestKey="guidesTariffs"
            deleteRequest={deleteTariff}
            renderModal={({ open, onOpenChange }) => (
              <TariffModal
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

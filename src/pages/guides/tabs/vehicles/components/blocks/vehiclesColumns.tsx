import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { Vehicle } from '@/api/get/getGuides/getVehicles/types.ts';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deleteVehicle } from '@/api';
import VehiclesModal from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { SharedTypeBadge } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

export const useVehiclesColumns = (): ColumnDef<Vehicle>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<Vehicle>[]>(
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
        accessorFn: (row) => row.plate_number,
        id: 'PLATE_NUMBER',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.PLATE_NUMBER' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.plate_number}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.type,
        id: 'TYPE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.TYPE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedTypeBadge type={info.row.original.type} />
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.brand,
        id: 'BRAND',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.BRAND' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.brand}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.model,
        id: 'MODEL',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.MODEL' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.model}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.avg_fuel_consumption,
        id: 'AVERAGE_FUEL_CONSUMPTION',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.AVERAGE_FUEL_CONSUMPTION' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.avg_fuel_consumption}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.status,
        id: 'STATUS',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.STATUS' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedStatusBadge status={info.row.original.status} />
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
            invalidateRequestKey="guidesVehicles"
            deleteRequest={deleteVehicle}
            renderModal={({ open, onOpenChange }) => (
              <VehiclesModal
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

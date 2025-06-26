import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { Subdivision } from '@/api/get/getGlobalParams/getGlobalParamsSubdivisions/types.ts';
import { SubdivisionsMenuOptions } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsMenuOprions.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';

interface UseColumnsProps {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const useSubdivisionsColumns = ({
  onRowClick,
  onDeleteClick
}: UseColumnsProps): ColumnDef<Subdivision>[] => {
  const { isRTL } = useLanguage();
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<Subdivision>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.ID' })} column={column} />
        ),
        enableSorting: false,
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
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.SUBDIVISION' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary cursor-pointer"
              onClick={() => onRowClick(info.row.original.id)}
            >
              {info.row.original.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.company?.company_name,
        id: 'company',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.COMPANY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.company?.company_name}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]'
        }
      },
      {
        accessorFn: (row) => row.currency.name,
        id: 'currency',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CURRENCY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.currency.name}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.language.name,
        id: 'language',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.LANGUAGE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.language.name}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.is_active,
        id: 'active',
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
          <SubdivisionsMenuOptions id={info.row.original.id} onDeleteClick={onDeleteClick} />
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

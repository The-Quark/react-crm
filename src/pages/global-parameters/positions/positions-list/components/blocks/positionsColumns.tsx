import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { Position } from '@/api/get/getGlobalParams/getGlobalParamsPositions/types.ts';
import { PositionsMenuOptions } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsMenuOprions.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';

interface UseColumnsProps {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
  onViewClick: (id: number) => void;
  onFormClick: (id: number) => void;
}

export const usePositionsColumns = ({
  onRowClick,
  onDeleteClick,
  onViewClick,
  onFormClick
}: UseColumnsProps): ColumnDef<Position>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { formatMessage } = useIntl();
  const { has } = useUserPermissions();

  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';

  const columns = useMemo<ColumnDef<Position>[]>(
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
            <span className="leading-none text-gray-800 font-normal">{info.row.original.id}</span>
          </div>
        ),
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.title,
        id: 'POSITION',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.POSITION' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary cursor-pointer"
              onClick={() => onRowClick(info.row.original.id)}
            >
              {info.row.original.title}
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
        id: 'COMPANY',
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
          headerClassName: 'min-w-[200px]'
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
          <PositionsMenuOptions
            id={info.row.original.id}
            onDeleteClick={onDeleteClick}
            onViewClick={onViewClick}
            onFormClick={onFormClick}
          />
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, canManage, onDeleteClick]
  );
  return canManage ? columns : columns.slice(0, -1);
};

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon } from '@/components';
import { useLanguage } from '@/providers';
import { Cargo } from '@/api/get/getWorkflow/getCargo/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DateRange } from 'react-day-picker';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';
import { filterDateRange } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRestore } from '@/api';

export const useCargoBlockColumns = (): ColumnDef<Cargo>[] => {
  const { formatMessage } = useIntl();
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const queryClient = useQueryClient();

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const restoreMutation = useMutation({
    mutationFn: (data: { id: number }) => postRestore({ id: data.id, type: 'cargo' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
    }
  });

  const handleRestore = (id: number) => {
    restoreMutation.mutate({ id });
  };

  const columns = useMemo<ColumnDef<Cargo>[]>(
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
        accessorFn: (row) => row.code,
        id: 'MAWB',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.MAWB' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none font-medium text-sm text-gray-900">
              {info.row.original.code}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.packages?.map((pkg) => pkg.hawb).join(', ') || '-',
        id: 'HAWB',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.HAWB' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-1">
            {info.row.original.packages?.length ? (
              info.row.original.packages.map((pkg, index) => (
                <div key={`${pkg.hawb}-${index}`} className="flex items-center gap-1.5">
                  <div className="leading-none text-gray-800 font-normal">{pkg.hawb}</div>
                </div>
              ))
            ) : (
              <div className="leading-none text-gray-400 font-normal">-</div>
            )}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal py-2'
        }
      },
      {
        accessorFn: (row) => row.document_count,
        id: 'DOCUMENT_COUNT',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.DOCUMENT_COUNT' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.document_count}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row?.delivery_category?.map((category) => category).join(', ') ?? '',
        id: 'DELIVERY_CATEGORY',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-1">
            {info.row?.original?.delivery_category?.map((category, index) => (
              <div key={`${category}-${index}`} className="flex items-center gap-1.5">
                <div className="leading-none text-gray-800 font-normal">{category}</div>
              </div>
            )) ?? null}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal py-2'
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
        accessorFn: (row) => row.created_at,
        id: 'CREATED_AT',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.CREATED_AT' })}
            column={column}
          />
        ),
        enableSorting: false,
        filterFn: (row, columnId, filterValue: DateRange) =>
          filterDateRange(row.getValue(columnId), filterValue),
        cell: (info) => {
          const date = new Date(info.row.original.created_at);
          const formattedDate = date.toLocaleDateString('ru-RU');

          return (
            <div className="flex items-center gap-1.5">
              <div className="leading-none text-gray-800 font-normal">{formattedDate}</div>
            </div>
          );
        },
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
          <div className="flex items-center gap-1.5">
            <button
              className="btn btn-sm btn-icon btn-primary"
              onClick={() => handleRestore(info.row.original.id)}
              disabled={restoreMutation.isPending}
            >
              <KeenIcon icon="arrows-circle" />
            </button>
          </div>
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, canManage]
  );
  return canManage ? columns : columns.slice(0, -1);
};

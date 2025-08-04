import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon } from '@/components';
import { useLanguage } from '@/providers';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DateRange } from 'react-day-picker';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';
import { filterDateRange } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRestore } from '@/api';

export const usePackagesBlockColumns = (): ColumnDef<Package>[] => {
  const { formatMessage } = useIntl();
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const queryClient = useQueryClient();

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const restoreMutation = useMutation({
    mutationFn: (data: { id: number }) => postRestore({ id: data.id, type: 'package' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
    }
  });

  const handleRestore = (id: number) => {
    restoreMutation.mutate({ id });
  };

  const columns = useMemo<ColumnDef<Package>[]>(
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
        accessorFn: (row) => row.hawb,
        id: 'HAWB',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.HAWB' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none font-medium text-sm text-gray-900">
              {info.row.original.hawb}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => {
          const client = row?.client;
          return client?.type === 'individual'
            ? `${client?.first_name} ${client.last_name} ${client.patronymic ?? ''}`.trim()
            : client?.company_name || '';
        },
        id: 'CLIENT',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CLIENT' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          const client = info.row.original.client;
          const fullName =
            client?.type === 'individual'
              ? `${client.first_name} ${client.last_name} ${client.patronymic ?? ''}`.trim()
              : client?.company_name;

          return (
            <div className="flex flex-col gap-0.5">
              <div className="leading-none text-gray-800 font-normal">{fullName}</div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.hawb_pdf,
        id: 'HAWB_DOC',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.HAWB_DOC' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          const url = info.row.original.hawb_pdf.startsWith('http')
            ? info.row.original.hawb_pdf
            : `https://${info.row.original.hawb_pdf}`;

          return (
            <div className="flex items-center gap-1.5">
              <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                HAWB
              </a>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row?.delivery_category,
        id: 'CATEGORY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CATEGORY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original?.delivery_category}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row?.assigned_user,
        id: 'ASSIGNED',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.ASSIGNED' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          const user = info.row.original?.assigned_user;
          const fullName = [user?.first_name, user?.last_name, user?.patronymic]
            .filter(Boolean)
            .join(' ');

          return (
            <div className="flex items-center gap-1.5">
              <span className="leading-none text-gray-800 font-normal">{fullName}</span>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row?.order?.nominal_cost,
        id: 'NOMINAL_COST',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.NOMINAL_COST' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original?.order?.nominal_cost
                ? `${info.row.original?.order?.nominal_cost} $`
                : '-'}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[60px]'
        }
      },
      {
        accessorFn: (row) => row?.shipping_cost,
        id: 'SHIPPING_COST',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.SHIPPING_COST' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original?.shipping_cost ? `${info.row.original?.shipping_cost} $` : '-'}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[60px]'
        }
      },
      {
        accessorFn: (row) => row?.customs_clearance_cost,
        id: 'CUSTOMS_CLEARANCE',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.CUSTOMS_CLEARANCE' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original?.shipping_cost ? `${info.row.original?.shipping_cost} $` : '-'}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[60px]'
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
            {info.row.original.order?.is_express && <SharedStatusBadge status="express" />}
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

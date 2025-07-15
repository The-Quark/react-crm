import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DateRange } from 'react-day-picker';
import { OrdersMenuOptions } from '@/pages/call-center/orders/ordersList/components/blocks/ordersMenuOptions.tsx';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { filterDateRange } from '@/utils';

interface UseColumnsProps {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const useOrdersColumns = ({
  onRowClick,
  onDeleteClick
}: UseColumnsProps): ColumnDef<Order>[] => {
  const { formatMessage } = useIntl();
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const columns = useMemo<ColumnDef<Order>[]>(
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
        accessorFn: (row) => row.order_code,
        id: 'ORDER_CODE',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.ORDER_CODE' })}
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
              {info.row.original.order_code}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.sender?.full_name,
        id: 'SENDER',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.SENDER' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original?.sender?.full_name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.receiver?.full_name,
        id: 'RECEIVER',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.RECEIVER' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original?.receiver?.full_name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.delivery_category,
        id: 'CATEGORY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CATEGORY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.delivery_category}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.hawb_pdf,
        id: 'QR',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.QR' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          if (!info.row.original.hawb_pdf || info.row.original.hawb_pdf.trim() === '') {
            return (
              <div className="text-gray-400 text-center">
                {formatMessage({ id: 'SYSTEM.NO_QR' })}
              </div>
            );
          }

          const url = info.row.original.hawb_pdf.startsWith('http')
            ? info.row.original.hawb_pdf
            : `https://${info.row.original.hawb_pdf}`;

          return (
            <div className="flex items-center gap-1.5 group justify-center">
              <img
                src={url}
                alt="QR Code"
                className="w-14 h-14 object-contain transition-transform group-hover:scale-150 self-center"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.outerHTML = `<a class="link" href="${url}" target="_blank" rel="noopener noreferrer">qr.svg</a>`;
                }}
              />
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]'
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
            {info.row.original.is_express && <SharedStatusBadge status="express" />}
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
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {OrdersMenuOptions({
                id: info.row.original.id,
                onDeleteClick: onDeleteClick,
                clientRating: info.row.original.application?.client?.client_rating
              })}
            </MenuItem>
          </Menu>
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, canManage, onRowClick]
  );
  return canManage ? columns : columns.slice(0, -1);
};

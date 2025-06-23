import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DateRange } from 'react-day-picker';
import { OrdersMenuOptions } from '@/pages/call-center/orders/ordersList/components/blocks/ordersMenuOptions.tsx';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';

interface UseColumnsProps {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const useOrdersColumns = ({
  onRowClick,
  onDeleteClick
}: UseColumnsProps): ColumnDef<Order>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
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
        id: 'order code',
        header: ({ column }) => <DataGridColumnHeader title="Order code" column={column} />,
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
        id: 'sender full name',
        header: ({ column }) => <DataGridColumnHeader title="Sender" column={column} />,
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
        id: 'receiver full name',
        header: ({ column }) => <DataGridColumnHeader title="Receiver" column={column} />,
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
        id: 'delivery category',
        header: ({ column }) => <DataGridColumnHeader title="Category" column={column} />,
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
        id: 'hawb pdf',
        header: ({ column }) => <DataGridColumnHeader title="QR" column={column} />,
        enableSorting: false,
        cell: (info) => {
          if (!info.row.original.hawb_pdf || info.row.original.hawb_pdf.trim() === '') {
            return <div className="text-gray-400">No QR</div>;
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
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
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
        id: 'created at',
        header: ({ column }) => <DataGridColumnHeader title="Created at" column={column} />,
        enableSorting: false,
        filterFn: (row, columnId, filterValue: DateRange) => {
          if (!filterValue) return true;
          const date = new Date(row.getValue(columnId));
          const { from, to } = filterValue;
          if (from && to) {
            return date >= from && date <= to;
          }
          if (from) {
            return date >= from;
          }
          if (to) {
            return date <= to;
          }
          return true;
        },
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
                      offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
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
                onDeleteClick: onDeleteClick
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

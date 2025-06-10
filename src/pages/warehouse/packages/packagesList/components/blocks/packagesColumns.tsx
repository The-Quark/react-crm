import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DateRange } from 'react-day-picker';
import { PackagesMenuOptions } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesMenuOptions.tsx';

interface UseColumnsProps {
  onRowClick: (id: number) => void;
}

export const usePackagesColumns = ({ onRowClick }: UseColumnsProps): ColumnDef<Package>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const columns = useMemo<ColumnDef<Package>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        enableSorting: true,
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
        id: 'hawb',
        header: ({ column }) => <DataGridColumnHeader title="HAWB" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary cursor-pointer"
              onClick={() => onRowClick(info.row.original.id)}
            >
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
        id: 'client full name',
        header: ({ column }) => <DataGridColumnHeader title="Client" column={column} />,
        enableSorting: true,
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
        accessorFn: (row) => row.status,
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.status}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.hawb_pdf,
        id: 'hawb pdf',
        header: ({ column }) => <DataGridColumnHeader title="HAWB doc" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const url = info.row.original.hawb_pdf.startsWith('http')
            ? info.row.original.hawb_pdf
            : `https://${info.row.original.hawb_pdf}`;

          return (
            <div className="flex items-center gap-1.5">
              <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                hawb.pdf
              </a>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.order?.delivery_category,
        id: 'delivery category',
        header: ({ column }) => <DataGridColumnHeader title="Category" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.order?.delivery_category}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.created_at,
        id: 'created at',
        header: ({ column }) => <DataGridColumnHeader title="Created at" column={column} />,
        enableSorting: true,
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
                      offset: isRTL() ? [0, -10] : [0, 10]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {PackagesMenuOptions({
                id: info.row.original.id
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

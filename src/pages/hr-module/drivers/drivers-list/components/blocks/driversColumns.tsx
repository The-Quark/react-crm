import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { UserModel } from '@/api/get/getUser/getUsersList/types.ts';
import { toAbsoluteUrl } from '@/utils';
import { DriversMenuOptions } from '@/pages/hr-module/drivers/drivers-list/components/blocks/driversMenuOptions.tsx';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';

const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

export const useDriversColumns = (): ColumnDef<UserModel>[] => {
  const { isRTL } = useLanguage();
  const columns = useMemo<ColumnDef<UserModel>[]>(
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
        accessorFn: (row) =>
          `${row.first_name} ${row.last_name}${row.patronymic ? ` ${row.patronymic}` : ''}`,
        id: 'driver',
        header: ({ column }) => <DataGridColumnHeader title="Driver" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const fullName = `${info.row.original.first_name} ${info.row.original.last_name}${
            info.row.original.patronymic ? ` ${info.row.original.patronymic}` : ''
          }`;

          return (
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                <img
                  src={
                    info.row.original.avatar
                      ? `${STORAGE_URL}/${info.row.original.avatar}`
                      : toAbsoluteUrl('/media/avatars/blank.png')
                  }
                  className="h-9 rounded-full"
                  alt="Avatar"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <a
                  className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                  href={`/crm/users/public-profile/${info.row.original.id}`}
                >
                  {fullName}
                </a>
                <span className="text-2sm text-gray-700 font-normal">
                  {info.row.original.position?.title || ''}
                </span>
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.phone,
        id: 'phone',
        header: ({ column }) => <DataGridColumnHeader title="Phone" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.phone}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row?.license_category,
        id: 'license category',
        header: ({ column }) => <DataGridColumnHeader title="License category" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original?.license_category}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.vehicle?.plate_number,
        id: 'delivery_count',
        header: ({ column }) => <DataGridColumnHeader title="Delivery count" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">mock</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.vehicle?.plate_number,
        id: 'active_delivery_count',
        header: ({ column }) => (
          <DataGridColumnHeader title="Active delivery count" column={column} />
        ),
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">mock</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row?.driver_status,
        id: 'driver status',
        header: ({ column }) => <DataGridColumnHeader title="Driver status" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedStatusBadge status={info.row.original?.driver_status ?? ''} />
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.updated_at,
        id: 'recentlyActivity',
        header: ({ column }) => <DataGridColumnHeader title="Recent activity" column={column} />,
        enableSorting: true,
        sortingFn: 'datetime',
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {new Date(info.row.original.updated_at).toLocaleString()}
            </div>
          </div>
        ),
        meta: {
          headerTitle: 'Recent activity',
          headerClassName: 'min-w-[150px]',
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
              {DriversMenuOptions({
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
    [isRTL]
  );
  return columns;
};

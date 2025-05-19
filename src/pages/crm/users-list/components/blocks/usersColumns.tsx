import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { UserModel } from '@/api/get/getUsersList/types.ts';
import { UsersMenuOptions } from '@/pages/crm/users-list/components/blocks/usersMenuOptions.tsx';
import { toAbsoluteUrl } from '@/utils';

const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

export const useUsersColumns = (): ColumnDef<UserModel>[] => {
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
        id: 'user',
        header: ({ column }) => <DataGridColumnHeader title="User" column={column} />,
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
                <div className="leading-none font-medium text-sm text-gray-900">{fullName}</div>
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
        accessorFn: (row) => row.roles[0].name,
        id: 'role',
        header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-wrap gap-2.5 mb-2">
            <div className="badge badge-sm badge-light badge-outline">
              {info.row.original.roles[0].name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.company?.company_name,
        id: 'company name',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.company?.company_name}
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
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.status}</div>
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
              {UsersMenuOptions({
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

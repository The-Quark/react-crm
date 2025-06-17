import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { ClientsListMenuOptions } from '@/pages/clients/clients-list/components/blocks/clientsListMenuOptions.tsx';
import { useLanguage } from '@/providers';
import { Client } from '@/api/get/getClients/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

interface Props {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const useClientsListIndividualColumns = ({
  onRowClick,
  onDeleteClick
}: Props): ColumnDef<Client>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';

  const columnsIndividual = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
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
        accessorFn: (row) => row?.fullname,
        id: 'full name',
        header: ({ column }) => <DataGridColumnHeader title="Client" column={column} />,
        enableSorting: false,
        cell: (info) => {
          return (
            <div className="flex items-center gap-s2.5">
              <div className="flex flex-col gap-0.5">
                <div
                  className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                  onClick={() => onRowClick(info.row.original.id)}
                >
                  {info.row.original.fullname}
                </div>
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
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.phone}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]'
        }
      },
      {
        accessorFn: (row) => row?.source?.name,
        id: 'source',
        header: ({ column }) => <DataGridColumnHeader title="Source" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original?.source?.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]'
        }
      },
      {
        accessorFn: (row) => row?.city_name,
        id: 'city name',
        header: ({ column }) => <DataGridColumnHeader title="City" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original?.city_name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]'
        }
      },
      {
        accessorFn: (row) => row?.email,
        id: 'email',
        header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original?.email}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]'
        }
      },
      {
        accessorFn: (row) => row?.birth_date,
        id: 'birth date',
        header: ({ column }) => <DataGridColumnHeader title="Birth date" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original?.birth_date}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.application_count,
        id: 'applications',
        header: ({ column }) => <DataGridColumnHeader title="Applications" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.application_count}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.applications_packages_count,
        id: 'applications packages',
        header: ({ column }) => (
          <DataGridColumnHeader title="Applications packages" column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.applications_packages_count}
            </div>
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
          <>
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
                {ClientsListMenuOptions({
                  id: info.row.original.id,
                  onDeleteClick: onDeleteClick
                })}
              </MenuItem>
            </Menu>
          </>
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, onRowClick, onDeleteClick]
  );
  return canManage ? columnsIndividual : columnsIndividual.slice(0, -1);
};

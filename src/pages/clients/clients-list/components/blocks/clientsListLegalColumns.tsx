import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { ClientsListMenuOptions } from '@/pages/clients/clients-list/components/blocks/clientsListMenuOptions.tsx';
import { useLanguage } from '@/providers';
import { Client } from '@/api/get/getClients/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useIntl } from 'react-intl';

interface Props {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const useClientsListLegalColumns = ({
  onRowClick,
  onDeleteClick
}: Props): ColumnDef<Client>[] => {
  const { isRTL } = useLanguage();
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';

  const columnsLegal = useMemo<ColumnDef<Client>[]>(
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
        accessorFn: (row) => row?.initials_code,
        id: 'CODE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CODE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
              onClick={() => onRowClick(info.row.original.id)}
            >
              {info.row.original?.initials_code}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.company_name,
        id: 'COMPANY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.COMPANY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <div
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                onClick={() => onRowClick(info.row.original.id)}
              >
                {info.row.original.company_name}
              </div>
              <span className="text-2sm text-gray-700 font-normal">
                {`BIN: ${info.row.original.bin}`}
              </span>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.phone,
        id: 'PHONE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.PHONE' })} column={column} />
        ),
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
        id: 'SOURCE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.SOURCE' })} column={column} />
        ),
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
        id: 'CITY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CITY' })} column={column} />
        ),
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
        id: 'EMAIL',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.EMAIL' })} column={column} />
        ),
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
        accessorFn: (row) => row.application_count,
        id: 'APPLICATIONS',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.APPLICATIONS' })}
            column={column}
          />
        ),
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
        id: 'PACKAGES',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.PACKAGES' })} column={column} />
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
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, onRowClick, onDeleteClick]
  );

  return canManage ? columnsLegal : columnsLegal.slice(0, -1);
};

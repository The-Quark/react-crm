import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { ParameterMenuOptions } from '@/pages/global-parameters/companies/companies-list/components/blocks/companiesMenuOptions.tsx';
import { ParametersModel } from '@/api/get/getGlobalParameters/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

export const useParametersColumns = (): ColumnDef<ParametersModel>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<ParametersModel>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        enableSorting: true,
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
        accessorFn: (row) => row.company_name,
        id: 'company name',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <a
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                href={`/global-parameters/view-parameters/${info.row.original.id}`}
              >
                {info.row.original.company_name}
              </a>
              <span className="text-2sm text-gray-700 font-normal">
                {`Language: ${info.row.original.language.name}, Currency: ${info.row.original.currency}`}
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
        accessorFn: (row) => row.timezone,
        id: 'timezone',
        header: ({ column }) => <DataGridColumnHeader title="Timezone" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-wrap gap-2.5 mb-2">
            <span className="badge badge-sm badge-light badge-outline">
              {info.row.original.timezone}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]'
        }
      },
      {
        accessorFn: (row) => row.legal_address,
        id: 'legal address',
        header: ({ column }) => <DataGridColumnHeader title="Legal address" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.legal_address}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.warehouse_address,
        id: 'warehouse address',
        header: ({ column }) => <DataGridColumnHeader title="Warehouse address" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.warehouse_address}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.airlines,
        id: 'airlines',
        header: ({ column }) => <DataGridColumnHeader title="Airlines" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const airlines = info.row.original.airlines;
          return (
            <div className="text-gray-800 font-normal leading-none">
              {airlines.map((airline) => airline.name).join(', ')}
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[165px]',
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
              {ParameterMenuOptions({
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
    [isRTL, canManage]
  );
  return canManage ? columns : columns.slice(0, -1);
};

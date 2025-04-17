import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FakeLegalClient } from '@/lib/mocks.ts';
import {
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  KeenIcon,
  Menu,
  MenuItem,
  MenuToggle
} from '@/components';
import { ClientsListMenuOptions } from '@/pages/clients/clients-list/components/blocks/clientsListMenuOptions.tsx';
import { useLanguage } from '@/providers';
interface Props {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useClientsListLegalColumns = ({ setReload }: Props): ColumnDef<FakeLegalClient>[] => {
  const { isRTL } = useLanguage();
  const columnsLegal = useMemo<ColumnDef<FakeLegalClient>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.id,
        id: 'client id',
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        enableSorting: true,
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
        accessorFn: (row) => row.companyName,
        id: 'company name',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <a
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                href="#"
              >
                {info.row.original.companyName}
              </a>
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
        id: 'company phone',
        header: ({ column }) => <DataGridColumnHeader title="Phone" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-wrap gap-2.5 mb-2">
            <span className="badge badge-sm badge-light badge-outline">
              {info.row.original.phone}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]'
        }
      },
      {
        accessorFn: (row) => row.orderCount,
        id: 'orders',
        header: ({ column }) => <DataGridColumnHeader title="Orders" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.orderCount}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.activeOrder,
        id: 'active orders',
        header: ({ column }) => <DataGridColumnHeader title="Active Orders" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.activeOrder}
            </span>
          </div>
        ),
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
                      offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
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
                handleReload: () => setReload((prev) => !prev)
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

  return columnsLegal;
};

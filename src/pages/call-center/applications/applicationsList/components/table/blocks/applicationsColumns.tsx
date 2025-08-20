import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/providers';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { ApplicationsMenuOptions } from '@/pages/call-center/applications/applicationsList/components/table/blocks/applicationsMenuOptions.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DateRange } from 'react-day-picker';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';
import { filterDateRange } from '@/utils';

interface UseApplicationsColumnsProps {
  onRowClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const useApplicationsColumns = ({
  onRowClick,
  onDeleteClick
}: UseApplicationsColumnsProps): ColumnDef<Application>[] => {
  const { formatMessage } = useIntl();
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';

  const columns = useMemo<ColumnDef<Application>[]>(
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
        accessorFn: (row) => row?.full_name,
        id: 'APPLICATION',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.APPLICATION' })}
            column={column}
          />
        ),
        enableSorting: false,
        cell: (info) => {
          return (
            <div className="flex flex-col gap-0.5">
              <div
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary cursor-pointer"
                onClick={() => onRowClick(info.row.original.id)}
              >
                {info.row.original?.full_name}
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.phone,
        id: 'PHONE_NUMBER',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
            column={column}
          />
        ),
        enableSorting: false,
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
        accessorFn: (row) => row.source.name,
        id: 'SOURCE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.SOURCE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.source.name}
            </span>
          </div>
        ),
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
              {ApplicationsMenuOptions({
                id: info.row.original.id,
                onDeleteClick: onDeleteClick,
                onRowClick: onRowClick
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

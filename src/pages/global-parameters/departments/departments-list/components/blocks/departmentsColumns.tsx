import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { Department } from '@/api/get/getGlobalParams/getGlobalParamsDepartments/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { DepartmentsMenuOptions } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsMenuOptions.tsx';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';

export const useDepartmentsColumns = (): ColumnDef<Department>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<Department>[]>(
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
        accessorFn: (row) => row.name,
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Department" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <div className="leading-none font-medium text-sm ">{info.row.original.name}</div>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.company?.company_name,
        id: 'company',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.company?.company_name}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]'
        }
      },
      {
        accessorFn: (row) => row.is_active,
        id: 'is active',
        header: ({ column }) => <DataGridColumnHeader title="Active" column={column} />,
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <SharedStatusBadge status={info.row.original.is_active} />
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
        cell: (info) => <DepartmentsMenuOptions id={info.row.original.id} />,
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, canManage]
  );
  return canManage ? columns : columns.slice(0, -1);
};

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deletePackageMaterial } from '@/api';
import { PackageMaterial } from '@/api/get/getGuides/getPackageMaterials/types.ts';
import PackageMaterialsModal from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { useIntl } from 'react-intl';

export const usePackageMaterialsColumns = (): ColumnDef<PackageMaterial>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<PackageMaterial>[]>(
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
        accessorFn: (row) => row.name,
        id: 'NAME',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.NAME' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.name}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.code,
        id: 'CODE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.CODE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.code}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.price,
        id: 'PRICE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.PRICE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.price}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.unit.name,
        id: 'UNIT',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.UNIT' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.unit.name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.company.map((c) => c.company_name).join(', '),
        id: 'COMPANY',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.COMPANY' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          const companyNames = info.row.original.company.map((c) => c.company_name);
          return (
            <div className="flex items-center gap-1.5">
              <div className="leading-none text-gray-800 font-normal">
                {companyNames.join(', ')}
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.is_active,
        id: 'ACTIVE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.ACTIVE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <SharedStatusBadge status={info.row.original.is_active} />
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
          <GuidesMenuOptions
            id={info.row.original.id}
            invalidateRequestKey="packageMaterials"
            deleteRequest={deletePackageMaterial}
            renderModal={({ open, onOpenChange }) => (
              <PackageMaterialsModal
                open={open}
                onOpenChange={() => onOpenChange(true)}
                id={info.row.original.id}
              />
            )}
          />
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL]
  );
  return canManage ? columns : columns.slice(0, -1);
};

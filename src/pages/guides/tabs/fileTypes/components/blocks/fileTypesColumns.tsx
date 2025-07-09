import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deleteFileType } from '@/api';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { FileType } from '@/api/get/getGuides/getFileTypes/types.ts';
import FileTypeModal from '@/pages/guides/tabs/fileTypes/components/blocks/fileTypesModal.tsx';
import { useIntl } from 'react-intl';

export const useFileTypesColumns = (): ColumnDef<FileType>[] => {
  const { isRTL } = useLanguage();
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<FileType>[]>(
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
        id: 'SOURCE',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.SOURCE' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">{info.row.original.name}</div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.step,
        id: 'STEP',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.STEP' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">{info.row.original.step}</span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.types,
        id: 'TYPES',
        header: ({ column }) => (
          <DataGridColumnHeader title={formatMessage({ id: 'SYSTEM.TYPES' })} column={column} />
        ),
        enableSorting: false,
        cell: (info) => {
          const types = info.row.original.types;
          return (
            <div className="text-gray-800 font-normal leading-none">
              {types.map((type) => type).join(', ')}
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
          <GuidesMenuOptions
            id={info.row.original.id}
            invalidateRequestKey="guidesFileTypes"
            deleteRequest={deleteFileType}
            renderModal={({ open, onOpenChange }) => (
              <FileTypeModal
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

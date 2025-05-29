import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components';
import { useLanguage } from '@/providers';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deletePackageType } from '@/api';
import PackageTypesModal from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesModal.tsx';
import { PackageType } from '@/api/get/getPackageTypes/types.ts';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';

interface Language {
  id: number;
  code: string;
  name: string;
}

interface Props {
  languages: Language[];
  selectedLanguage: string;
}

export const usePackageTypesColumns = ({
  languages,
  selectedLanguage
}: Props): ColumnDef<PackageType>[] => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const columns = useMemo<ColumnDef<PackageType>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
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
        accessorFn: (row) => row.code,
        id: 'code',
        header: ({ column }) => <DataGridColumnHeader title="Code" column={column} />,
        enableSorting: true,
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
        accessorFn: (row) => {
          const lang = row.language.find((l) => l.crm_language?.code === selectedLanguage);
          return lang?.name || '';
        },
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Package type" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const lang = info.row.original.language.find(
            (l) => l.crm_language?.code === selectedLanguage
          );
          return (
            <div className="flex flex-col gap-0.5">
              <div className="leading-none text-gray-800 font-normal">{lang?.name || ''}</div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) =>
          row.language
            .map((lang) => lang.crm_language?.code)
            .filter(Boolean)
            .join(', '),
        id: 'language_code',
        header: ({ column }) => <DataGridColumnHeader title="Language Codes" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const languageCodes = info.row.original.language
            .map((lang) => lang.crm_language?.code)
            .filter(Boolean)
            .join(', ');
          return (
            <div className="flex items-center gap-1.5">
              <div className="leading-none text-gray-800 font-normal">{languageCodes}</div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => {
          const lang = row.language.find((l) => l.crm_language?.code === selectedLanguage);
          return lang?.description || '';
        },
        id: 'description',
        header: ({ column }) => <DataGridColumnHeader title="Description" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const lang = info.row.original.language.find(
            (l) => l.crm_language?.code === selectedLanguage
          );
          return (
            <div className="flex items-center gap-1.5">
              <div className="leading-none text-gray-800 font-normal">
                {lang?.description || ''}
              </div>
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.is_active,
        id: 'active',
        header: ({ column }) => <DataGridColumnHeader title="Active" column={column} />,
        enableSorting: true,
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
            invalidateRequestKey="package-types"
            deleteRequest={deletePackageType}
            renderModal={({ open, onOpenChange }) => (
              <PackageTypesModal
                open={open}
                onOpenChange={onOpenChange}
                id={info.row.original.id}
                languages={languages}
                selectedLanguage={selectedLanguage}
              />
            )}
          />
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL, languages, selectedLanguage]
  );
  return canManage ? columns : columns.slice(0, -1);
};

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components';
import { useLanguage } from '@/providers';
import { GuidesMenuOptions } from '@/pages/guides/components/guidesMenuOptions.tsx';
import { deletePackageType } from '@/api';
import PackageTypesModal from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesModal.tsx';
import { PackageType } from '@/api/get/getPackageTypes/types.ts';

interface Language {
  id: number;
  code: string;
  name: string;
}

interface Props {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  languages: Language[];
  selectedLanguage: string;
}

export const usePackageTypesColumns = ({
  setReload,
  languages,
  selectedLanguage
}: Props): ColumnDef<PackageType>[] => {
  const { isRTL, currentLanguage } = useLanguage();
  const columns = useMemo<ColumnDef<PackageType>[]>(
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
        id: 'package type id',
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
        accessorFn: (row) => row.language[0].name,
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Package type" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.language[0].name}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
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
        accessorFn: (row) => row.language[0].description,
        id: 'description',
        header: ({ column }) => <DataGridColumnHeader title="Description" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.language[0].description}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.language_code,
        id: 'language code',
        header: ({ column }) => <DataGridColumnHeader title="Language" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <div className="leading-none text-gray-800 font-normal">{currentLanguage.code}</div>
          </div>
        ),
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
            <div className="leading-none text-gray-800 font-normal">
              {info.row.original.is_active ? 'Yes' : 'No'}
            </div>
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
            handleReload={() => setReload((prev) => !prev)}
            deleteRequest={deletePackageType}
            renderModal={({ open, onOpenChange }) => (
              <PackageTypesModal
                open={open}
                onOpenChange={onOpenChange}
                setReload={setReload}
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
    [isRTL, setReload, languages, selectedLanguage]
  );
  return columns;
};

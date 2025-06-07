import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import PackageMaterialsModal from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/lib/helpers.ts';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
}

export const PackageMaterialsToolbar: FC<ToolbarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const { table } = useDataGrid();
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageGlobalSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('name')?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Package Materials</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            New package material
          </button>
        )}
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search package materials"
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <PackageMaterialsModal open={modalOpen} onOpenChange={handleClose} />
    </div>
  );
};

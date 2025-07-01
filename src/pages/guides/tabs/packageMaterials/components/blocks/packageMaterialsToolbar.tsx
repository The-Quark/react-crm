import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import PackageMaterialsModal from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { useIntl } from 'react-intl';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
}

export const PackageMaterialsToolbar: FC<ToolbarProps> = ({ onSearch }) => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { formatMessage } = useIntl();
  const { has } = useUserPermissions();
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
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
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.PACKAGE_MATERIALS' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            {formatMessage({ id: 'SYSTEM.NEW_PACKAGE_MATERIAL' })}
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_PACKAGE_MATERIAL' })}
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

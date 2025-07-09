import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import UnitModal from '@/pages/guides/tabs/units/components/blocks/unitsModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';
import { useIntl } from 'react-intl';

interface ToolbarProps {
  onSearch?: (searchTerm: string) => void;
}

export const UnitsToolbar: FC<ToolbarProps> = ({ onSearch }) => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();
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
    table.getColumn('NAME')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.UNITS' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            {formatMessage({ id: 'SYSTEM.NEW_UNIT' })}
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_UNIT' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <UnitModal open={modalOpen} onOpenChange={handleClose} />
    </div>
  );
};

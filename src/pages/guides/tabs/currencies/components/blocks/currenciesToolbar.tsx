import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import CurrenciesModal from '@/pages/guides/tabs/currencies/components/blocks/currenciesModal.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

export const CurrenciesToolbar: FC = () => {
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

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Currencies</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            New Currency
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
            placeholder="Search currency"
            className="input input-sm ps-8"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
      <CurrenciesModal open={modalOpen} onOpenChange={handleClose} />
    </div>
  );
};

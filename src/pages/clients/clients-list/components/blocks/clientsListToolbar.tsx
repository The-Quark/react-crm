import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/lib/helpers.ts';

interface Props {
  clientType: 'individual' | 'legal';
  setClientType: React.Dispatch<React.SetStateAction<'individual' | 'legal'>>;
  onSearch?: (searchTerm: string) => void;
}

export const ClientsListToolbar: FC<Props> = ({ clientType, setClientType, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const { table } = useDataGrid();
  const nameColumn = clientType === 'individual' ? 'client name' : 'company name';
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn(nameColumn)?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-5">
          <label className="radio-group">
            <input
              className="radio-sm"
              name="clientType"
              type="radio"
              value="individual"
              checked={clientType === 'individual'}
              onChange={() => setClientType('individual')}
            />
            <span className="radio-label">Individual</span>
          </label>
          <label className="radio-group">
            <input
              className="radio-sm"
              name="clientType"
              type="radio"
              value="legal"
              checked={clientType === 'legal'}
              onChange={() => setClientType('legal')}
            />
            <span className="radio-label">Legal</span>
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/clients/starter-clients" className="btn btn-sm btn-primary">
            New client
          </a>
        )}
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={`Search ${clientType === 'individual' ? 'client' : 'company'}`}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

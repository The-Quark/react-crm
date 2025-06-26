import React, { useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { useIntl } from 'react-intl';

interface TasksToolbarProps {
  onSearch?: (searchTerm: string) => void;
}

export const TasksToolbar: React.FC<TasksToolbarProps> = ({ onSearch }) => {
  const { formatMessage } = useIntl();
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const [searchValue, setSearchValue] = useState('');
  const canManage = has('manage tasks') || currentUser?.roles[0].name === 'superadmin';

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
    table.getColumn('title')?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.TASKS' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/tasks/starter" className="btn btn-sm btn-primary">
            {formatMessage({ id: 'SYSTEM.NEW_TASK' })}
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_TASK' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useIntl } from 'react-intl';

export const CountriesToolbar: FC = () => {
  const { table } = useDataGrid();
  const { formatMessage } = useIntl();

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.COUNTRIES' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRIES' })}
            className="input input-sm ps-8"
            value={(table.getColumn('COUNTRY')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('COUNTRY')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

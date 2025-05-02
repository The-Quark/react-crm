import React, { FC } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';

interface Props {
  clientType: 'individual' | 'legal';
  setClientType: React.Dispatch<React.SetStateAction<'individual' | 'legal'>>;
}

export const ClientsListToolbar: FC<Props> = ({ clientType, setClientType }) => {
  const { table } = useDataGrid();
  const nameColumn = clientType === 'individual' ? 'client name' : 'company name';
  const phoneColumn = clientType === 'individual' ? 'client phone' : 'company phone';

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
        <a href="/global-parameters/starter-parameters" className="btn btn-sm btn-primary">
          New global parameter
        </a>
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
            value={(table.getColumn(nameColumn)?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn(nameColumn)?.setFilterValue(e.target.value)}
          />
        </div>
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search phone number"
            className="input input-sm ps-8"
            value={(table.getColumn(phoneColumn)?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn(phoneColumn)?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useIntl } from 'react-intl';

interface Country {
  id: number;
  iso2: string;
  name: string;
}

interface Props {
  currentCountry: string;
  countries: Country[];
  onCountryChange: (countryCode: string) => void;
}

export const CitiesToolbar: FC<Props> = ({ currentCountry, onCountryChange, countries }) => {
  const { table } = useDataGrid();
  const { formatMessage } = useIntl();

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.PACKAGE_TYPES' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <Select value={currentCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-28" size="sm">
            <SelectValue placeholder={formatMessage({ id: 'SYSTEM.SELECT_COUNTRY' })} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.iso2} value={country.iso2}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_CITY' })}
            className="input input-sm ps-8"
            value={(table.getColumn('CITY')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('CITY')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

import React, { FC, useState, useCallback, useMemo } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/lib/helpers.ts';
import { SharedAutocompleteBase } from '@/partials/sharedUI';

interface Props {
  clientType: 'individual' | 'legal';
  setClientType: React.Dispatch<React.SetStateAction<'individual' | 'legal'>>;
  onSearchTerm?: (searchTerm: string) => void;
  onSearchPhone?: (searchPhone: string) => void;
  currentCityId?: number;
  onClientCity?: (city: number) => void;
}

const MOCK_CITIES = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Новосибирск' },
  { id: 4, name: 'Екатеринбург' },
  { id: 5, name: 'Казань' },
  { id: 6, name: 'Нижний Новгород' },
  { id: 7, name: 'Челябинск' },
  { id: 8, name: 'Самара' },
  { id: 9, name: 'Омск' },
  { id: 10, name: 'Ростов-на-Дону' }
];

export const ClientsListToolbar: FC<Props> = ({
  clientType,
  setClientType,
  onSearchTerm,
  onSearchPhone,
  onClientCity,
  currentCityId
}) => {
  const [searchTermValue, setSearchTermValue] = useState('');
  const [searchPhoneValue, setSearchPhoneValue] = useState('');
  const [selectedClientCity, setSelectedClientCity] = useState<number | undefined>(currentCityId);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const nameColumn = clientType === 'individual' ? 'client name' : 'company name';
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';

  const handleClientTypeChange = useCallback(
    (type: 'individual' | 'legal') => () => setClientType(type),
    [setClientType]
  );

  const handleClientCityChange = useCallback(
    (val: number) => {
      setSelectedClientCity(val);
      onClientCity?.(val);
    },
    [onClientCity]
  );

  const filteredCities = useMemo(() => {
    return MOCK_CITIES.filter((city) =>
      city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
  }, [citySearchTerm]);

  const debouncedSearch = useMemo(
    () =>
      debounce((type: 'term' | 'phone', value: string) => {
        if (type === 'term') {
          onSearchTerm?.(value);
          table.getColumn(nameColumn)?.setFilterValue(value);
        } else {
          onSearchPhone?.(value);
          table.getColumn('phone')?.setFilterValue(value);
        }
      }, 300),
    [onSearchTerm, onSearchPhone, table, nameColumn]
  );

  const handleSearchChange = useCallback(
    (type: 'term' | 'phone') => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      if (type === 'phone' && !value.startsWith('+7') && value.length > 0) {
        value = '+7' + value.replace(/^\+7/, '');
      }

      if (type === 'term') {
        setSearchTermValue(value);
      } else {
        setSearchPhoneValue(value);
      }

      debouncedSearch(type, value);
    },
    [debouncedSearch]
  );

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
              onChange={handleClientTypeChange('individual')}
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
              onChange={handleClientTypeChange('legal')}
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
        <div className="w-64">
          <SharedAutocompleteBase
            value={selectedClientCity ?? ''}
            options={filteredCities}
            placeholder="Select city"
            searchPlaceholder="Search city"
            onChange={handleClientCityChange}
            onSearchTermChange={setCitySearchTerm}
            searchTerm={citySearchTerm}
            size="sm"
          />
        </div>
        <DataGridColumnVisibility table={table} />
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="tel"
            placeholder="+7 (000) 000-00-00"
            className="input input-sm ps-8"
            value={searchPhoneValue}
            onChange={handleSearchChange('phone')}
            maxLength={16}
          />
        </div>
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder={`Search ${clientType === 'individual' ? 'client' : 'company'}`}
            className="input input-sm ps-8"
            value={searchTermValue}
            onChange={handleSearchChange('term')}
          />
        </div>
      </div>
    </div>
  );
};

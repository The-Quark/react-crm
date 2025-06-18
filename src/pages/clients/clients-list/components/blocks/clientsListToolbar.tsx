import React, { FC, useState, useCallback, useMemo } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { useQuery } from '@tanstack/react-query';
import { getClientsCities } from '@/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';

interface Props {
  clientType: 'individual' | 'legal';
  setClientType: React.Dispatch<React.SetStateAction<'individual' | 'legal'>>;
  onSearchTerm?: (searchTerm: string) => void;
  onSearchPhone?: (searchPhone: string) => void;
  currentCityId?: number;
  onClientCity?: (city: number) => void;
}

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
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const nameColumn = clientType === 'individual' ? 'full name' : 'company name';
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';

  const handleClientTypeChange = useCallback(
    (type: 'individual' | 'legal') => () => setClientType(type),
    [setClientType]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['clientCities'],
    queryFn: () => getClientsCities(),
    refetchOnWindowFocus: true
  });

  const handleClientCityChange = useCallback(
    (value: string) => {
      if (value === '__CLEAR__') {
        setSelectedClientCity(undefined);
        onClientCity?.(null as unknown as number);
        table.getColumn('city name')?.setFilterValue(undefined);
      } else {
        const cityId = value ? Number(value) : undefined;
        setSelectedClientCity(cityId);
        onClientCity?.(cityId as number);
        table.getColumn('city name')?.setFilterValue(cityId);
      }
    },
    [onClientCity, table]
  );

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

      if (type === 'phone') {
        if (value === '') {
          setSearchPhoneValue('');
          debouncedSearch('phone', '');
          return;
        }
        if (!value.startsWith('+7') && searchPhoneValue === '') {
          value = '+7' + value;
        }
        value = value.replace(/[^\d+]/g, '');

        if (value.length > 12) {
          value = value.slice(0, 12);
        }
      }

      if (type === 'term') {
        setSearchTermValue(value);
      } else {
        setSearchPhoneValue(value);
      }

      debouncedSearch(type, value);
    },
    [debouncedSearch, searchPhoneValue]
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
          <Select
            value={selectedClientCity ? String(selectedClientCity) : ''}
            onValueChange={handleClientCityChange}
            disabled={isLoading}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder={isLoading ? 'Loading...' : 'Select city'} />
            </SelectTrigger>
            <SelectContent>
              {selectedClientCity && (
                <SelectItem value="__CLEAR__">
                  <span className="text-muted-foreground">Clear selection</span>
                </SelectItem>
              )}

              {data?.result?.length ? (
                data.result.map((city) => (
                  <SelectItem key={city.city_id} value={String(city.city_id)}>
                    {city.city_name}
                  </SelectItem>
                ))
              ) : (
                <div className="py-1.5 pl-8 pr-2 text-sm text-muted-foreground">
                  No cities available
                </div>
              )}
            </SelectContent>
          </Select>
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

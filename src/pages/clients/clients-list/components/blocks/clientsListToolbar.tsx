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
import { useIntl } from 'react-intl';
import { ClientType } from '@/api/generalManualTypes';
import { PHONE_MAX_LENGTH, SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface Props {
  clientType: ClientType;
  setClientType: (type: ClientType) => void;
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
  const { formatMessage } = useIntl();
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const [searchTermValue, setSearchTermValue] = useState('');
  const [searchPhoneValue, setSearchPhoneValue] = useState('');
  const [selectedClientCity, setSelectedClientCity] = useState<number | undefined>(currentCityId);

  const nameColumn = clientType === 'individual' ? 'CLIENT' : 'COMPANY';
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';

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
        table.getColumn('CITY')?.setFilterValue(undefined);
      } else {
        const cityId = value ? Number(value) : undefined;
        setSelectedClientCity(cityId);
        onClientCity?.(cityId as number);
        table.getColumn('CITY')?.setFilterValue(cityId);
      }
    },
    [onClientCity, table]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((type: 'TERM' | 'PHONE', value: string) => {
        if (type === 'TERM') {
          onSearchTerm?.(value);
          table.getColumn(nameColumn)?.setFilterValue(value);
        } else {
          onSearchPhone?.(value);
          table.getColumn('PHONE')?.setFilterValue(value);
        }
      }, SEARCH_DEBOUNCE_DELAY),
    [onSearchTerm, onSearchPhone, table, nameColumn]
  );

  const handleSearchChange = useCallback(
    (type: 'TERM' | 'PHONE') => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      if (type === 'PHONE') {
        if (value === '') {
          setSearchPhoneValue('');
          debouncedSearch('PHONE', '');
          return;
        }
        if (!value.startsWith('+7') && searchPhoneValue === '') {
          value = '+7' + value;
        }
        value = value.replace(/[^\d+]/g, '');

        if (value.length > PHONE_MAX_LENGTH) {
          value = value.slice(0, PHONE_MAX_LENGTH);
        }
      }

      if (type === 'TERM') {
        setSearchTermValue(value);
      } else {
        setSearchPhoneValue(value);
      }

      debouncedSearch(type, value);
    },
    [debouncedSearch, searchPhoneValue]
  );

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-5">
          {(['individual', 'legal'] as ClientType[]).map((type) => (
            <label key={type} className="radio-group">
              <input
                className="radio-sm"
                name="clientType"
                type="radio"
                value={type}
                checked={clientType === type}
                onChange={() => setClientType(type)}
              />
              <span className="radio-label">
                {formatMessage({ id: `SYSTEM.${type.toUpperCase()}` })}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {canManage && (
          <a href="/clients/starter-clients" className="btn btn-sm btn-primary">
            {formatMessage({ id: 'SYSTEM.NEW_CLIENT' })}
          </a>
        )}

        <div className="w-64">
          <Select
            value={selectedClientCity ? String(selectedClientCity) : ''}
            onValueChange={handleClientCityChange}
            disabled={isLoading}
          >
            <SelectTrigger size="sm">
              <SelectValue
                placeholder={
                  isLoading
                    ? formatMessage({ id: 'SYSTEM.LOADING' })
                    : formatMessage({ id: 'SYSTEM.SELECT_CITY' })
                }
              />
            </SelectTrigger>
            <SelectContent>
              {selectedClientCity && (
                <SelectItem value="__CLEAR__">
                  <span className="text-muted-foreground">
                    {formatMessage({ id: 'SYSTEM.CLEAR_SELECTION' })}
                  </span>
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
                  {formatMessage({ id: 'SYSTEM.NO_VALUES' })}
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
            onChange={handleSearchChange('PHONE')}
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
            placeholder={`${formatMessage({ id: 'SYSTEM.SEARCH' })} ${clientType === 'individual' ? formatMessage({ id: 'SYSTEM.CLIENT' }) : formatMessage({ id: 'SYSTEM.COMPANY' })}`}
            className="input input-sm ps-8"
            value={searchTermValue}
            onChange={handleSearchChange('TERM')}
          />
        </div>
      </div>
    </div>
  );
};

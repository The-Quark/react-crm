import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import PackageTypesModal from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesModal.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { debounce } from '@/utils/lib/helpers.ts';
import { useIntl } from 'react-intl';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface Language {
  id: number;
  code: string;
  name: string;
}

interface Props {
  currentLanguage: string;
  languages: Language[];
  onLanguageChange: (languageCode: string) => void;
  onSearch: (searchTerm: string) => void;
}

export const PackageTypesToolbar: FC<Props> = ({
  currentLanguage,
  onLanguageChange,
  languages,
  onSearch
}) => {
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const { formatMessage } = useIntl();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
    table.getColumn('PACKAGE_TYPE')?.setFilterValue(value);
  }, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleLanguageSelectChange = (value: string) => {
    onLanguageChange(value);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.PACKAGE_TYPES' })}</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            {formatMessage({ id: 'SYSTEM.NEW_PACKAGE_TYPE' })}
          </button>
        )}
        <Select value={currentLanguage} onValueChange={handleLanguageSelectChange}>
          <SelectTrigger className="w-28" size="sm">
            <SelectValue placeholder={formatMessage({ id: 'SYSTEM.SELECT_LANGUAGE' })} />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                {language.name}
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
            placeholder={formatMessage({ id: 'SYSTEM.SEARCH_PACKAGE_TYPE' })}
            className="input input-sm ps-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <PackageTypesModal
        open={modalOpen}
        onOpenChange={handleClose}
        languages={languages}
        selectedLanguage={currentLanguage}
      />
    </div>
  );
};

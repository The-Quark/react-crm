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
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageGlobalSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const [searchValue, setSearchValue] = useState('');

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
    table.getColumn('title')?.setFilterValue(value);
  }, 300);

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
      <h3 className="card-title">Package Types</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={handleOpen}>
            New Package Type
          </button>
        )}
        <Select value={currentLanguage} onValueChange={handleLanguageSelectChange}>
          <SelectTrigger className="w-28" size="sm">
            <SelectValue placeholder="Select language" />
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
            placeholder="Search package type"
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

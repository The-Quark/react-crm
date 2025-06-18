import React, { FC, useState, useCallback, useMemo } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { TemplatesModal } from '@/pages/guides/tabs/templates/components/blocks/templatesModal.tsx';
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
  onSearchCode: (code: string) => void;
}

export const TemplatesToolbar: FC<Props> = ({
  currentLanguage,
  languages,
  onLanguageChange,
  onSearchCode
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const { table } = useDataGrid();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const canManageGlobalSettings = useMemo(
    () => has('manage global settings') || currentUser?.roles[0].name === 'superadmin',
    [has, currentUser]
  );

  const debouncedSearch = useMemo(
    () => ({
      code: debounce((value: string) => {
        onSearchCode?.(value);
        table.getColumn('code')?.setFilterValue(value);
      }, 300)
    }),
    [onSearchCode, table]
  );

  const handleSearchChange = useCallback(
    (type: 'code' | 'title') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (type === 'code') {
        setSearchCode(value);
        debouncedSearch.code(value);
      }
    },
    [debouncedSearch]
  );

  const handleModalToggle = useCallback((open: boolean) => {
    setModalOpen(open);
  }, []);

  const handleLanguageChange = useCallback(
    (value: string) => {
      onLanguageChange(value);
    },
    [onLanguageChange]
  );

  const renderSearchInput = (type: 'code' | 'title', placeholder: string, value: string) => (
    <div className="relative">
      <KeenIcon
        icon="magnifier"
        className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="input input-sm ps-8"
        value={value}
        onChange={handleSearchChange(type)}
      />
    </div>
  );

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Templates</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {canManageGlobalSettings && (
          <button className="btn btn-sm btn-primary" onClick={() => handleModalToggle(true)}>
            New Template
          </button>
        )}

        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
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
        {renderSearchInput('code', 'Search template code', searchCode)}
      </div>

      <TemplatesModal
        open={modalOpen}
        onOpenChange={handleModalToggle}
        selectedLanguage={currentLanguage}
      />
    </div>
  );
};

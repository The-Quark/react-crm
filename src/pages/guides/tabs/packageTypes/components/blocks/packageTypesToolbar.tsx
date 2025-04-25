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

interface Language {
  id: number;
  code: string;
  name: string;
}

interface Props {
  currentLanguage: string;
  languages: Language[];
  onLanguageChange: (languageCode: string) => void;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PackageTypesToolbar: FC<Props> = ({
  currentLanguage,
  onLanguageChange,
  setReload,
  languages
}) => {
  const { table } = useDataGrid();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleLanguageSelectChange = (value: string) => {
    onLanguageChange(value);
    setReload((prev) => !prev);
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Package Types</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search package type"
            className="input input-sm ps-8"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          />
        </div>
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
        <button className="btn btn-sm btn-primary" onClick={handleOpen}>
          New Package Type
        </button>
      </div>
      <PackageTypesModal
        open={modalOpen}
        onOpenChange={handleClose}
        setReload={setReload}
        languages={languages}
        selectedLanguage={currentLanguage}
      />
    </div>
  );
};

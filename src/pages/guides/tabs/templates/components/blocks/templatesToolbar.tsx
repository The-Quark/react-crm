import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { TemplatesModal } from '@/pages/guides/tabs/templates/components/blocks/templatesModal.tsx';

interface Language {
  id: number;
  code: string;
  name: string;
}

interface Props {
  currentLanguage: string;
  languages: Language[];
  onLanguageChange: (languageCode: string) => void;
}

export const TemplatesToolbar: FC<Props> = ({ currentLanguage, onLanguageChange, languages }) => {
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
  };

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Templates</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <button className="btn btn-sm btn-primary" onClick={handleOpen}>
          New Template
        </button>
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
            placeholder="Search templates code"
            className="input input-sm ps-8"
            value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('code')?.setFilterValue(e.target.value)}
          />
        </div>
      </div>
      <TemplatesModal
        open={modalOpen}
        onOpenChange={handleClose}
        selectedLanguage={currentLanguage}
      />
    </div>
  );
};

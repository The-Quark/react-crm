/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getLanguages, getPackageTypes } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { PackageTypesToolbar } from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesToolbar.tsx';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { usePackageTypesColumns } from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesColumns.tsx';
import { useLanguage } from '@/providers';
import { useState } from 'react';
import { TLanguageCode } from '@/i18n';

export const GuidesPackagesContent = () => {
  const { currentLanguage: defaultLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['package-types', selectedLanguage.code],
    queryFn: () => getPackageTypes(undefined, selectedLanguage.code)
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    error: isLanguageError
  } = useQuery({
    queryKey: ['languages'],
    queryFn: () => getLanguages()
  });

  const columns = usePackageTypesColumns({
    languages: languagesData?.result || [],
    selectedLanguage: selectedLanguage.code
  });

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage((prev) => ({ ...prev, code: languageCode as TLanguageCode }));
    refetch();
  };

  if (isError || isLanguageError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isLoading || isLanguagesLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={
            <PackageTypesToolbar
              currentLanguage={selectedLanguage.code}
              languages={languagesData?.result || []}
              onLanguageChange={handleLanguageChange}
            />
          }
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};

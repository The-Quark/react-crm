/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getLanguages, getPackageTypes } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { PackageTypesToolbar } from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesToolbar.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { usePackageTypesColumns } from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesColumns.tsx';
import { useLanguage } from '@/providers';
import { useState } from 'react';
import { TLanguageCode } from '@/i18n';

export const GuidesPackagesContent = () => {
  const { currentLanguage: defaultLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['package-types', selectedLanguage.code],
    queryFn: () => getPackageTypes(undefined, selectedLanguage.code),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    error: isLanguageError
  } = useQuery({
    queryKey: ['languages'],
    queryFn: () => getLanguages(),
    staleTime: 1000 * 60 * 60 // 1 hour
  });

  const columns = usePackageTypesColumns({ setReload: () => refetch() });

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage((prev) => ({ ...prev, code: languageCode as TLanguageCode }));
    refetch();
  };

  if (isError || isLanguageError) {
    return <GuidesError error={error} />;
  }

  return (
    <Container>
      {isLoading || isLanguagesLoading ? (
        <GuidesLoading />
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
              setReload={() => refetch()}
            />
          }
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};

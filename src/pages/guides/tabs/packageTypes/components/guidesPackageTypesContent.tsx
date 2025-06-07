/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getLanguages, getPackageTypes } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { PackageTypesToolbar } from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesToolbar.tsx';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { usePackageTypesColumns } from '@/pages/guides/tabs/packageTypes/components/blocks/packageTypesColumns.tsx';
import { useLanguage } from '@/providers';
import { useState } from 'react';
import { TLanguageCode } from '@/i18n';

export const GuidesPackagesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const { currentLanguage: defaultLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'package-types',
      selectedLanguage.code,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getPackageTypes({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        code: searchTerm,
        language_code: selectedLanguage.code
      }),
    staleTime: 1000 * 60 * 60
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    error: isLanguageError
  } = useQuery({
    queryKey: ['guidesPackageTypeLanguages'],
    queryFn: () => getLanguages({}),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = usePackageTypesColumns({
    languages: languagesData?.result || [],
    selectedLanguage: selectedLanguage.code
  });

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage((prev) => ({ ...prev, code: languageCode as TLanguageCode }));
  };

  if (isError || isLanguageError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={data?.result || []}
        onFetchData={handleFetchData}
        toolbar={
          <PackageTypesToolbar
            currentLanguage={selectedLanguage.code}
            languages={languagesData?.result || []}
            onLanguageChange={handleLanguageChange}
            onSearch={handleSearch}
          />
        }
        layout={{ card: true }}
        pagination={{
          page: pagination.pageIndex,
          size: pagination.pageSize,
          total: data?.total || 0
        }}
        messages={{
          empty: isPending && <SharedLoading simple />,
          loading: isFetching && <SharedLoading simple />
        }}
      />
    </Container>
  );
};

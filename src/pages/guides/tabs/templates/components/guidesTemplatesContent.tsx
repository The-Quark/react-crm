/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getLanguages, getTemplates } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useLanguage } from '@/providers';
import { useState } from 'react';
import { TLanguageCode } from '@/i18n';
import { useTemplatesColumns } from '@/pages/guides/tabs/templates/components/blocks/templatesColumns.tsx';
import { TemplatesToolbar } from '@/pages/guides/tabs/templates/components/blocks/templatesToolbar.tsx';
import { CACHE_TIME, initialPagination } from '@/utils';

export const GuidesTemplatesContent = () => {
  const { currentLanguage: defaultLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [searchCodeTerm, setSearchCodeTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'guidesTemplates',
      selectedLanguage.code,
      pagination.pageIndex,
      pagination.pageSize,
      searchCodeTerm
    ],
    queryFn: () =>
      getTemplates({
        language_code: selectedLanguage.code,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        code: searchCodeTerm
      }),
    staleTime: CACHE_TIME
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    error: isLanguageError
  } = useQuery({
    queryKey: ['guidesTemplatesLanguages'],
    queryFn: () => getLanguages({}),
    refetchOnWindowFocus: false,
    staleTime: CACHE_TIME
  });

  const columns = useTemplatesColumns({
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

  const handleSearchCode = (code: string) => {
    setSearchCodeTerm(code);
    setPagination(initialPagination);
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
          <TemplatesToolbar
            currentLanguage={selectedLanguage.code}
            languages={languagesData?.result || []}
            onLanguageChange={handleLanguageChange}
            onSearchCode={handleSearchCode}
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

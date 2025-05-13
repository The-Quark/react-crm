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

export const GuidesTemplatesContent = () => {
  const { currentLanguage: defaultLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesTemplates', selectedLanguage.code],
    queryFn: () => getTemplates({ language_code: selectedLanguage.code })
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    error: isLanguageError
  } = useQuery({
    queryKey: ['guidesTemplatesLanguages'],
    queryFn: () => getLanguages(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = useTemplatesColumns({
    languages: languagesData?.result || [],
    selectedLanguage: selectedLanguage.code
  });

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage((prev) => ({ ...prev, code: languageCode as TLanguageCode }));
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
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={
            <TemplatesToolbar
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

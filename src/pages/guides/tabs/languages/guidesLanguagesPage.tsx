import React from 'react';
import { Container } from '@/components';
import { GuidesLanguagesContent } from '@/pages/guides/tabs/languages/components/guidesLanguagesContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesLanguagesPage = () => {
  return (
    <>
      <GuidesHeader />
      <Container>
        <GuidesLanguagesContent />
      </Container>
    </>
  );
};

import React from 'react';
import { Container } from '@/components';
import { GuidesAirlinesContent } from '@/pages/guides/tabs/airlines/components/guidesAirlinesContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesAirlinesPage = () => {
  return (
    <>
      <GuidesHeader />
      <Container>
        <GuidesAirlinesContent />
      </Container>
    </>
  );
};

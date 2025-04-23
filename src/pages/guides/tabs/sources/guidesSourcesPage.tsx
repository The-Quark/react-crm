import React from 'react';
import { Container } from '@/components';
import { GuidesSourcesContent } from '@/pages/guides/tabs/sources/components/guidesSourcesContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesSourcesPage = () => {
  return (
    <>
      <GuidesHeader />
      <Container>
        <GuidesSourcesContent />
      </Container>
    </>
  );
};

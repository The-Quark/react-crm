import React from 'react';
import { Container } from '@/components';
import { GuidesPackagesContent } from '@/pages/guides/tabs/packages/components/guidesPackageContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesPackagesPage = () => {
  return (
    <>
      <GuidesHeader />
      <Container>
        <GuidesPackagesContent />
      </Container>
    </>
  );
};

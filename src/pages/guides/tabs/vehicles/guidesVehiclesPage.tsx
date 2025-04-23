import React from 'react';
import { Container } from '@/components';
import { GuidesVehiclesContent } from '@/pages/guides/tabs/vehicles/components/guidesVehiclesContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesVehiclesPage = () => {
  return (
    <>
      <GuidesHeader />
      <Container>
        <GuidesVehiclesContent />
      </Container>
    </>
  );
};

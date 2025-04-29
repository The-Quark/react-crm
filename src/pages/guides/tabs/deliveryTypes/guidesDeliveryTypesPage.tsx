import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesDeliveryTypesContent } from '@/pages/guides/tabs/deliveryTypes/components/guidesDeliveryTypesContent.tsx';

export const GuidesDeliveryTypesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesDeliveryTypesContent />
    </>
  );
};

import React, { useState } from 'react';
import { OrdersSenderForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersSenderForm.tsx';
import { OrdersReceiverForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersReceiverForm.tsx';
import { OrdersMainForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersMainForm.tsx';

export const OrdersStarterContent = () => {
  const [activeStep, setActiveStep] = useState(1);
  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);
  return (
    <>
      {activeStep === 1 && <OrdersSenderForm onNext={nextStep} />}
      {activeStep === 2 && <OrdersReceiverForm onNext={nextStep} onBack={prevStep} />}
      {/*{activeStep === 3 && <OrdersMainForm onBack={prevStep} />}*/}
    </>
  );
};

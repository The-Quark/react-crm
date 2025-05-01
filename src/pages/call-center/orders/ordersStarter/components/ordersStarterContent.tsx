import { useState, useEffect } from 'react';
import { OrdersSenderForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersSenderForm.tsx';
import { OrdersReceiverForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersReceiverForm.tsx';
import { OrdersMainForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersMainForm.tsx';
import {
  OrderCreationProvider,
  useOrderCreation
} from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';

const OrderFormSteps = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { clearAll, senderId, receiverId } = useOrderCreation();

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  console.log('Current context values - senderId:', senderId, 'receiverId:', receiverId);

  useEffect(() => {
    if (activeStep === 1 && senderId) {
      setActiveStep(2);
    }
    if (activeStep === 2 && receiverId && senderId) {
      setActiveStep(3);
    }
  }, [senderId, activeStep, receiverId]);

  const handleNextFromSender = () => {
    if (!senderId) {
      console.warn('Cannot proceed - senderId is not set');
    }
  };

  const handleNextFromReceiver = () => {
    if (!receiverId) {
      console.warn('Cannot proceed - receiver is not set');
    }
  };

  const handleOrderSubmitSuccess = () => {
    setShowSuccessModal(true);
    clearAll();
  };

  return (
    <>
      {activeStep === 1 && <OrdersSenderForm onNext={handleNextFromSender} />}
      {activeStep === 2 && <OrdersReceiverForm onNext={handleNextFromReceiver} onBack={prevStep} />}
      {activeStep === 3 && (
        <OrdersMainForm onBack={prevStep} onSubmitSuccess={handleOrderSubmitSuccess} />
      )}

      {/*<OrderSuccessModal*/}
      {/*  isOpen={showSuccessModal}*/}
      {/*  onClose={() => {*/}
      {/*    setShowSuccessModal(false);*/}
      {/*    setActiveStep(1); // Возврат к первому шагу*/}
      {/*  }}*/}
      {/*/>*/}
    </>
  );
};
export const OrdersStarterContent = () => {
  return (
    <OrderCreationProvider>
      <OrderFormSteps />
    </OrderCreationProvider>
  );
};

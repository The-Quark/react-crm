import { useEffect, useState } from 'react';
import { OrdersSenderForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersSenderForm.tsx';
import { OrdersReceiverForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersReceiverForm.tsx';
import { OrdersMainForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersMainForm.tsx';
import {
  OrderCreationProvider,
  useOrderCreation
} from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

const OrderFormSteps = () => {
  const { id } = useParams<{ id: string }>();
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { clearAll, senderId, receiverId, setSenderId, setReceiverId, setApplicationId } =
    useOrderCreation();

  const {
    data: orderData,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrders(Number(id)),
    enabled: !!id
  });

  useEffect(() => {
    if (orderData) {
      setSenderId(orderData.result[0].sender_id);
      setReceiverId(orderData.result[0].receiver_id);
      setApplicationId(orderData.result[0].application_id);
      setActiveStep(3);
    }
  }, [orderData]);

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const handleOrderSubmitSuccess = () => {
    setShowSuccessModal(true);
    if (!id) clearAll();
  };

  if (isLoading) return <SharedLoading />;

  if (isError) return <SharedError error={error} />;

  return (
    <>
      {activeStep === 1 && <OrdersSenderForm onNext={nextStep} />}
      {activeStep === 2 && <OrdersReceiverForm onNext={nextStep} onBack={prevStep} />}
      {activeStep === 3 && (
        <OrdersMainForm
          onBack={prevStep}
          onSubmitSuccess={handleOrderSubmitSuccess}
          orderData={orderData?.result[0]}
        />
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

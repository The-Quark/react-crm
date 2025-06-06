import { useEffect, Fragment, useState } from 'react';
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
import { defineStepper } from '@stepperize/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { OrdersConfirmModal } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersConfirmModal.tsx';

const { useStepper, utils } = defineStepper(
  { id: 'main', title: 'Order Details' },
  { id: 'sender', title: 'Sender Information' },
  { id: 'receiver', title: 'Receiver Information' }
);

const OrderFormSteps = () => {
  const { id } = useParams<{ id: string }>();
  const { clearAll, setSenderId, setReceiverId, setApplicationId } = useOrderCreation();
  const stepper = useStepper();
  const currentStep = stepper.current;
  const currentIndex = utils.getIndex(currentStep.id);
  const allSteps = stepper.all;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orderData,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrders({ id: Number(id) }),
    enabled: !!id
  });

  useEffect(() => {
    if (orderData) {
      setSenderId(orderData.result[0].sender_id);
      setReceiverId(orderData.result[0].receiver_id);
      setApplicationId(orderData.result[0].application_id);
    }
  }, [orderData]);

  const handleOrderSubmitSuccess = () => {
    if (!id) clearAll();
  };

  if (isLoading) return <SharedLoading />;

  if (isError) return <SharedError error={error} />;

  return (
    <div className="space-y-6 p-6 border rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{id ? 'Edit Order' : 'Create New Order'}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {allSteps.length}
          </span>
        </div>
      </div>

      <nav aria-label="Order creation steps" className="my-4">
        <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
          {allSteps.map((step, index, array) => {
            const isActive = step.id === currentStep.id;
            const isCompleted = index < currentIndex;

            return (
              <Fragment key={step.id}>
                <li className="flex items-center gap-4 flex-shrink-0">
                  <Button
                    type="button"
                    role="tab"
                    variant={isActive ? 'default' : isCompleted ? 'default' : 'outline'}
                    aria-current={isActive ? 'step' : undefined}
                    aria-posinset={index + 1}
                    aria-setsize={allSteps.length}
                    aria-selected={isActive}
                    className="flex size-10 items-center justify-center rounded-full"
                    onClick={() => stepper.goTo(step.id)}
                  >
                    {index + 1}
                  </Button>
                  <span className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                    {step.title}
                  </span>
                </li>
                {index < array.length - 1 && (
                  <Separator className={`flex-1 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>

      <div className="space-y-4">
        <StepContent
          onOrderSubmit={handleOrderSubmitSuccess}
          orderData={orderData?.result[0]}
          stepper={stepper}
          orderId={id ?? ''}
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          handleOpen={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
};

const StepContent = ({
  onOrderSubmit,
  orderData,
  stepper,
  orderId,
  open,
  handleClose,
  handleOpen
}: {
  onOrderSubmit: () => void;
  orderData?: Order;
  stepper: ReturnType<typeof useStepper>;
  orderId: string;
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}) => {
  return (
    <>
      {stepper.current.id === 'main' && (
        <div className="grid gap-4">
          <OrdersMainForm onNext={stepper.next} orderData={orderData} orderId={orderId} />
        </div>
      )}

      {stepper.current.id === 'sender' && (
        <div className="grid gap-4">
          <OrdersSenderForm onNext={stepper.next} onBack={stepper.prev} orderData={orderData} />
        </div>
      )}

      {stepper.current.id === 'receiver' && (
        <div className="grid gap-4">
          <OrdersReceiverForm
            onBack={stepper.prev}
            onConfirmModal={handleOpen}
            orderData={orderData}
          />
        </div>
      )}
      <OrdersConfirmModal open={open} handleClose={handleClose} onOrderSubmit={onOrderSubmit} />
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

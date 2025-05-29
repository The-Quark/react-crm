import { useEffect, useState, Fragment } from 'react';
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

const { useStepper, steps, utils } = defineStepper(
  { id: 'sender', title: 'Sender Information' },
  { id: 'receiver', title: 'Receiver Information' },
  { id: 'main', title: 'Order Details' }
);

const OrderFormSteps = () => {
  const { id } = useParams<{ id: string }>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { clearAll, setSenderId, setReceiverId, setApplicationId } = useOrderCreation();
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);

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
    }
  }, [orderData]);

  const handleOrderSubmitSuccess = () => {
    setShowSuccessModal(true);
    if (!id) clearAll();
  };

  if (isLoading) return <SharedLoading />;
  if (isError) return <SharedError error={error} />;

  return (
    <div className="space-y-6 p-6 border rounded-lg w-full max-w-4xl mx-auto">
      {/* Stepper navigation header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Create New Order</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Stepper progress indicator */}
      <nav aria-label="Order creation steps" className="my-4">
        <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
          {stepper.all.map((step, index, array) => (
            <Fragment key={step.id}>
              <li className="flex items-center gap-4 flex-shrink-0">
                <Button
                  type="button"
                  role="tab"
                  variant={index <= currentIndex ? 'default' : 'secondary'}
                  aria-current={stepper.current.id === step.id ? 'step' : undefined}
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full"
                  onClick={() => stepper.goTo(step.id)}
                >
                  {index + 1}
                </Button>
                <span className="text-sm font-medium">{step.title}</span>
              </li>
              {index < array.length - 1 && (
                <Separator
                  className={`flex-1 ${index < currentIndex ? 'bg-primary' : 'bg-muted'}`}
                />
              )}
            </Fragment>
          ))}
        </ol>
      </nav>

      <div className="space-y-4">
        <StepContent
          onOrderSubmitSuccess={handleOrderSubmitSuccess}
          orderData={orderData?.result[0]}
        />
      </div>
    </div>
  );
};

const StepContent = ({
  onOrderSubmitSuccess,
  orderData
}: {
  onOrderSubmitSuccess: () => void;
  orderData?: any;
}) => {
  const stepper = useStepper();

  return (
    <>
      {stepper.switch({
        sender: () => (
          <div className="grid gap-4">
            <OrdersSenderForm onNext={stepper.next} />
            <div className="flex justify-end">
              <Button onClick={stepper.next}>Next</Button>
            </div>
          </div>
        ),
        receiver: () => (
          <div className="grid gap-4">
            <OrdersReceiverForm onNext={stepper.next} onBack={stepper.prev} />
            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={stepper.prev}>
                Back
              </Button>
              <Button onClick={stepper.next}>Next</Button>
            </div>
          </div>
        ),
        main: () => (
          <div className="grid gap-4">
            <OrdersMainForm
              onBack={stepper.prev}
              onSubmitSuccess={onOrderSubmitSuccess}
              orderData={orderData}
            />
            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={stepper.prev}>
                Back
              </Button>
              <Button type="submit" form="order-main-form">
                {stepper.isLast ? 'Complete Order' : 'Next'}
              </Button>
            </div>
          </div>
        )
      })}
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

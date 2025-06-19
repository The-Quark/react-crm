import { Fragment, useState, FC } from 'react';
import { OrdersSenderForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersSenderForm.tsx';
import { OrdersReceiverForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersReceiverForm.tsx';
import { OrdersMainForm } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersMainForm.tsx';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { defineStepper } from '@stepperize/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrdersConfirmModal } from '@/pages/call-center/orders/ordersStarter/components/blocks/ordersConfirmModal.tsx';
import { IOrderPutFormValues, postOrder, postOrderDraft, putOrder } from '@/api';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';

interface Props {
  isEditMode: boolean;
  orderId?: number;
}

const { useStepper, utils } = defineStepper(
  { id: 'main', title: 'Order Details' },
  { id: 'sender', title: 'Sender Information' },
  { id: 'receiver', title: 'Receiver Information' }
);

const OrderFormSteps: FC<Props> = ({ isEditMode, orderId }) => {
  const stepper = useStepper();
  const currentStep = stepper.current;
  const currentIndex = utils.getIndex(currentStep.id);
  const allSteps = stepper.all;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderSubmit = async (data: IOrderFormValues) => {
    try {
      if (isEditMode) {
        const putData = { ...data, id: orderId as number } as IOrderPutFormValues;
        await putOrder(orderId as number, putData);
      } else {
        await postOrder(data);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleOrderDraftSubmit = async (data: IOrderFormValues) => {
    try {
      await postOrderDraft(data);
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{isEditMode ? 'Edit Order' : 'Create New Order'}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            s Step {currentIndex + 1} of {allSteps.length}
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
          onOrderSubmit={handleOrderSubmit}
          onOrderDraftSubmit={handleOrderDraftSubmit}
          stepper={stepper}
          open={isModalOpen}
          isEditMode={isEditMode}
          handleClose={() => setIsModalOpen(false)}
          handleOpen={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
};

const StepContent = ({
  onOrderSubmit,
  onOrderDraftSubmit,
  stepper,
  open,
  handleClose,
  handleOpen,
  isEditMode
}: {
  onOrderSubmit: (orderData: IOrderFormValues) => Promise<void>;
  onOrderDraftSubmit: (orderData: IOrderFormValues) => Promise<void>;
  stepper: ReturnType<typeof useStepper>;
  open: boolean;
  isEditMode: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}) => {
  const { mainFormData, clearAll } = useOrderCreation();

  const handleSubmit = async (data: IOrderFormValues) => {
    await onOrderSubmit(data);
    clearAll();
  };

  const handleDraftSubmit = async (data: IOrderFormValues) => {
    await onOrderDraftSubmit(data);
    clearAll();
  };

  return (
    <>
      {stepper.current.id === 'main' && (
        <div className="grid gap-4">
          <OrdersMainForm onNext={stepper.next} isEditMode={isEditMode} />
        </div>
      )}

      {stepper.current.id === 'sender' && (
        <div className="grid gap-4">
          <OrdersSenderForm onNext={stepper.next} onBack={stepper.prev} isEditMode={isEditMode} />
        </div>
      )}

      {stepper.current.id === 'receiver' && (
        <div className="grid gap-4">
          <OrdersReceiverForm
            onBack={stepper.prev}
            onConfirmModal={handleOpen}
            isEditMode={isEditMode}
          />
        </div>
      )}
      <OrdersConfirmModal
        open={open}
        handleClose={handleClose}
        onOrderSubmit={handleSubmit}
        onOrderDraftSubmit={handleDraftSubmit}
        orderData={mainFormData as IOrderFormValues}
      />
    </>
  );
};

export const OrdersStarterContent: FC<Props> = ({ isEditMode, orderId }) => {
  return <OrderFormSteps isEditMode={isEditMode} orderId={orderId} />;
};

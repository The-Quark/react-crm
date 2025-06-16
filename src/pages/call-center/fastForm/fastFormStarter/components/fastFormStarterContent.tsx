import { Fragment, useState } from 'react';
import { defineStepper } from '@stepperize/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FastFormContentApplicationForm } from '@/pages/call-center/fastForm/fastFormStarter/components/blocks/fastFormContentApplicationForm.tsx';
import { FastFormContentOrderForm } from '@/pages/call-center/fastForm/fastFormStarter/components/blocks/fastFromContentOrderForm.tsx';
import {
  FastFormCreatorProvider,
  IFastFormContext
} from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';
import { FastFormContentSenderForm } from '@/pages/call-center/fastForm/fastFormStarter/components/blocks/fastFormContentSenderForm.tsx';
import { FastFormContentReceiverForm } from '@/pages/call-center/fastForm/fastFormStarter/components/blocks/fastFormContentReceiverForm.tsx';
import { FastFormContentConfirmModal } from '@/pages/call-center/fastForm/fastFormStarter/components/blocks/fastFormContentConfirmModal.tsx';
import { postFastForm } from '@/api';
import { IFastFormFormValues } from '@/api/post/postWorkflow/postFastForm/types.ts';

const { useStepper, utils } = defineStepper(
  { id: 'application', title: 'Application' },
  { id: 'order', title: 'Order' },
  { id: 'sender', title: 'Sender' },
  { id: 'receiver', title: 'Receiver' }
);

const FastFormFormSteps = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stepper = useStepper();
  const currentStep = stepper.current;
  const currentIndex = utils.getIndex(currentStep.id);
  const allSteps = stepper.all;

  const handleFastFormSubmit = async (data: IFastFormContext) => {
    try {
      const formValues = data as unknown as IFastFormFormValues;
      console.log('Request body: ', formValues);
      await postFastForm(formValues);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg w-full mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Fast form</h2>
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
          stepper={stepper}
          onFastFormSubmit={handleFastFormSubmit}
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          handleOpen={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
};

const StepContent = ({
  stepper,
  onFastFormSubmit,
  handleClose,
  handleOpen,
  open
}: {
  stepper: ReturnType<typeof useStepper>;
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  onFastFormSubmit: (formData: IFastFormContext) => Promise<void>;
}) => {
  const handleSubmit = async (data: IFastFormContext) => {
    await onFastFormSubmit(data);
  };

  return (
    <>
      {stepper.current.id === 'application' && (
        <FastFormContentApplicationForm onNext={stepper.next} />
      )}
      {stepper.current.id === 'order' && (
        <FastFormContentOrderForm onNext={stepper.next} onBack={stepper.prev} />
      )}
      {stepper.current.id === 'sender' && (
        <FastFormContentSenderForm onNext={stepper.next} onBack={stepper.prev} />
      )}
      {stepper.current.id === 'receiver' && (
        <FastFormContentReceiverForm onConfirmModal={handleOpen} onBack={stepper.prev} />
      )}
      <FastFormContentConfirmModal
        open={open}
        onOrderSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </>
  );
};

export const FastFormStarterContent = () => {
  return (
    <FastFormCreatorProvider>
      <FastFormFormSteps />
    </FastFormCreatorProvider>
  );
};

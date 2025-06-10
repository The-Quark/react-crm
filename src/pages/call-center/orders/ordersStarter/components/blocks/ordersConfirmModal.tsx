import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import { DialogActions } from '@mui/material';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';

interface Props {
  open: boolean;
  onOrderSubmit: (orderData: IOrderFormValues) => Promise<void>;
  handleClose: () => void;
  orderData: IOrderFormValues;
}

export const OrdersConfirmModal: FC<Props> = ({ open, handleClose, onOrderSubmit, orderData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mainFormData } = useOrderCreation();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!mainFormData) throw new Error('mainFormData is null');
      await onOrderSubmit(mainFormData);
      handleClose();
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            Order Form Details
          </DialogTitle>
          <button
            className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
            data-modal-dismiss="true"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </DialogHeader>
        <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
          <div className="card pb-2.5">
            <div className="card-body grid gap-5">
              {/* Sender Block */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">Order info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Application</label>
                    <div className="flex columns-1 w-full">{orderData?.application_id || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery Type</label>
                    <div className="flex columns-1 w-full">{orderData?.delivery_type || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <button className="btn btn-md btn-light mr-3 mb-3">Send To Drafts</button>
          <button
            className="btn btn-md btn-primary mr-3 mb-3"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            Confirm Order
          </button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

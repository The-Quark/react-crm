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
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_CURRENCY_KEY } from '@/utils';

interface Props {
  open: boolean;
  onOrderSubmit: (orderData: IOrderFormValues) => Promise<void>;
  onOrderDraftSubmit: (orderData: IOrderFormValues) => Promise<void>;
  handleClose: () => void;
  orderData: IOrderFormValues;
}

export const OrdersConfirmModal: FC<Props> = ({
  open,
  handleClose,
  onOrderSubmit,
  orderData,
  onOrderDraftSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mainFormData, modalInfo } = useOrderCreation();
  const navigate = useNavigate();
  const currentCurrency = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!mainFormData) throw new Error('mainFormData is null');
      await onOrderSubmit(mainFormData);
      handleClose();
      navigate('/call-center/orders/list');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraftConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!mainFormData) throw new Error('mainFormData is null');
      await onOrderDraftSubmit(mainFormData);
      handleClose();
      navigate('/call-center/orders/list');
    } catch (error) {
      console.error('Error submitting draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFullName = (firstName?: string, lastName?: string, patronymic?: string | null) => {
    return [firstName, lastName, patronymic].filter(Boolean).join(' ') || '-';
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
              {/* Main */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">Main info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Application</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.application_full_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery type</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.delivery_type_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery category</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.delivery_category || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">International</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.is_international ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Package Type</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.package_type_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Order content</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.order_content?.join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Custom Clearance</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.customs_clearance ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Weight (kg)</label>
                    <div className="flex columns-1 w-full">{mainFormData?.weight || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Width (cm)</label>
                    <div className="flex columns-1 w-full">{mainFormData?.width || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Length (cm)</label>
                    <div className="flex columns-1 w-full">{mainFormData?.length || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Height (cm)</label>
                    <div className="flex columns-1 w-full">{mainFormData?.height || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Volume</label>
                    <div className="flex columns-1 w-full">{mainFormData?.volume || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Place count</label>
                    <div className="flex columns-1 w-full">{mainFormData?.places_count || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      Price ({currentCurrency})
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.price || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Package description</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.package_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Special wishes</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.special_wishes || '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sender */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">Sender info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Full name</label>
                    <div className="flex columns-1 w-full">
                      {formatFullName(
                        mainFormData?.sender_first_name,
                        mainFormData?.sender_last_name,
                        mainFormData?.sender_patronymic
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Country</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.sender_country_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">City</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.sender_city_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">{mainFormData?.sender_phone || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Address</label>
                    <div className="flex columns-1 w-full">
                      {[
                        mainFormData?.sender_street,
                        mainFormData?.sender_house,
                        mainFormData?.sender_apartment
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      Location description
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.sender_location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Notes</label>
                    <div className="flex columns-1 w-full">{mainFormData?.sender_notes || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Receiver */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Receiver info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Full name</label>
                    <div className="flex columns-1 w-full">
                      {formatFullName(
                        mainFormData?.receiver_first_name,
                        mainFormData?.receiver_last_name,
                        mainFormData?.receiver_patronymic
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Country</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.receiver_country_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">City</label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.receiver_city_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.receiver_phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Address</label>
                    <div className="flex columns-1 w-full">
                      {[
                        mainFormData?.receiver_street,
                        mainFormData?.receiver_house,
                        mainFormData?.receiver_apartment
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      Location description
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.receiver_location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Notes</label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.receiver_notes || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <button
            className="btn btn-md btn-light mr-3 mb-3"
            onClick={handleDraftConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading' : 'Send To Draft'}
          </button>
          <button
            className="btn btn-md btn-primary mr-3 mb-3"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading' : 'Confirm Order'}
          </button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

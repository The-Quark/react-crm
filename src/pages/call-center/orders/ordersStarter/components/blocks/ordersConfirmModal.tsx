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

interface Props {
  open: boolean;
  onOrderSubmit: (orderData: IOrderFormValues) => Promise<void>;
  handleClose: () => void;
  orderData: IOrderFormValues;
}

export const OrdersConfirmModal: FC<Props> = ({ open, handleClose, onOrderSubmit, orderData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mainFormData } = useOrderCreation();
  const navigate = useNavigate();

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
                    <div className="flex columns-1 w-full">{orderData?.application_id || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Source</label>
                    <div className="flex columns-1 w-full">{orderData?.source_id || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery type</label>
                    <div className="flex columns-1 w-full">{orderData?.delivery_type || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery category</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.delivery_category || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">International</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.is_international ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Package Type</label>
                    <div className="flex columns-1 w-full">{orderData?.package_type || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Order content</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.order_content?.join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Custom Clearance</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.customs_clearance ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Weight (kg)</label>
                    <div className="flex columns-1 w-full">{orderData?.weight || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Width (m)</label>
                    <div className="flex columns-1 w-full">{orderData?.width || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Length (m)</label>
                    <div className="flex columns-1 w-full">{orderData?.length || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Height (m)</label>
                    <div className="flex columns-1 w-full">{orderData?.height || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Volume</label>
                    <div className="flex columns-1 w-full">{orderData?.volume || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Place count</label>
                    <div className="flex columns-1 w-full">{orderData?.places_count || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Price ($)</label>
                    <div className="flex columns-1 w-full">{orderData?.price || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Package description</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.package_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Special wishes</label>
                    <div className="flex columns-1 w-full">{orderData?.special_wishes || '-'}</div>
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
                        orderData?.sender_first_name,
                        orderData?.sender_last_name,
                        orderData?.sender_patronymic
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Country</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.sender_country_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">City</label>
                    <div className="flex columns-1 w-full">{orderData?.sender_city_id || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">{orderData?.sender_phone || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Address</label>
                    <div className="flex columns-1 w-full">
                      {[
                        orderData?.sender_street,
                        orderData?.sender_house,
                        orderData?.sender_apartment
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
                      {orderData?.sender_location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Notes</label>
                    <div className="flex columns-1 w-full">{orderData?.sender_notes || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Receiver */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">Receiver info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Full name</label>
                    <div className="flex columns-1 w-full">
                      {formatFullName(
                        orderData?.receiver_first_name,
                        orderData?.receiver_last_name,
                        orderData?.receiver_patronymic
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Country</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.receiver_country_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">City</label>
                    <div className="flex columns-1 w-full">
                      {orderData?.receiver_city_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">{orderData?.receiver_phone || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Address</label>
                    <div className="flex columns-1 w-full">
                      {[
                        orderData?.receiver_street,
                        orderData?.receiver_house,
                        orderData?.receiver_apartment
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
                      {orderData?.receiver_location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Notes</label>
                    <div className="flex columns-1 w-full">{orderData?.receiver_notes || '-'}</div>
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

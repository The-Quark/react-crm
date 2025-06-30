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
import { useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOrderSubmit: (orderData: IOrderFormValues) => Promise<void>;
  onOrderDraftSubmit: (orderData: IOrderFormValues) => Promise<void>;
  handleClose: () => void;
}

export const OrdersConfirmModal: FC<Props> = ({
  open,
  handleClose,
  onOrderSubmit,
  onOrderDraftSubmit
}) => {
  const { formatMessage } = useIntl();
  const { mainFormData, modalInfo } = useOrderCreation();
  const navigate = useNavigate();
  const currentCurrency = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!mainFormData) throw new Error('mainFormData is null');
      await onOrderSubmit(mainFormData);
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
            {formatMessage({ id: 'SYSTEM.ORDER_FORM_DETAILS' })}
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
                <h4 className="text-lg font-semibold mb-3">
                  {formatMessage({ id: 'SYSTEM.MAIN_INFO' })}
                </h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.APPLICATION' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.application_full_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.DELIVERY_TYPE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.delivery_type_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.delivery_category || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.INTERNATIONAL' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.is_international
                        ? formatMessage({ id: 'SYSTEM.ENABLED' })
                        : formatMessage({ id: 'SYSTEM.DISABLED' })}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PACKAGE_TYPE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.package_type_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.ORDER_CONTENT' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.order_content?.join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.CUSTOMS_CLEARANCE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.customs_clearance
                        ? formatMessage({ id: 'SYSTEM.ENABLED' })
                        : formatMessage({ id: 'SYSTEM.DISABLED' })}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.WEIGHT' })} (kg)
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.weight || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.WIDTH' })} (cm)
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.width || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.LENGTH' })} (cm)
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.length || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.HEIGHT' })} (cm)
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.height || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.VOLUME' })} (см³)
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.volume || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PLACES_COUNT' })}
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.places_count || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PRICE' })} ({currentCurrency})
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.price || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PACKAGE_DESCRIPTION' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.package_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.SPECIAL_WISHES' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.special_wishes || '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sender */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">
                  {formatMessage({ id: 'SYSTEM.SENDER_INFO' })}
                </h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.sender_type === 'legal'
                        ? mainFormData?.sender_company_name
                        : formatFullName(
                            mainFormData?.sender_first_name,
                            mainFormData?.sender_last_name,
                            mainFormData?.sender_patronymic
                          )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.COUNTRY' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.sender_country_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.CITY' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.sender_city_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PHONE' })}
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.sender_phone || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.ADDRESS' })}
                    </label>
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
                      {formatMessage({ id: 'SYSTEM.LOCATION_DESCRIPTION' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.sender_location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.NOTES' })}
                    </label>
                    <div className="flex columns-1 w-full">{mainFormData?.sender_notes || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Receiver */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  {formatMessage({ id: 'SYSTEM.RECEIVER_INFO' })}
                </h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.receiver_type === 'legal'
                        ? mainFormData?.receiver_company_name
                        : formatFullName(
                            mainFormData?.receiver_first_name,
                            mainFormData?.receiver_last_name,
                            mainFormData?.receiver_patronymic
                          )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.COUNTRY' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.receiver_country_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.CITY' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {modalInfo?.receiver_city_name || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PHONE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.receiver_phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.ADDRESS' })}
                    </label>
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
                      {formatMessage({ id: 'SYSTEM.LOCATION_DESCRIPTION' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainFormData?.receiver_location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.NOTES' })}
                    </label>
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
            {isSubmitting
              ? formatMessage({ id: 'SYSTEM.LOADING' })
              : formatMessage({ id: 'SYSTEM.SEND_TO_DRAFT' })}
          </button>
          <button
            className="btn btn-md btn-primary mr-3 mb-3"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? formatMessage({ id: 'SYSTEM.LOADING' })
              : formatMessage({ id: 'SYSTEM.CONFIRM_ORDER' })}
          </button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

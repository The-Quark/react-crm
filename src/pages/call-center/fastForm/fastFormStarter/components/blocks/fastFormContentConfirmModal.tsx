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
import { useNavigate } from 'react-router-dom';
import {
  IFastFormContext,
  useFastFormContext
} from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';
import { LOCAL_STORAGE_CURRENCY_KEY } from '@/utils';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOrderSubmit: (mainFormData: IFastFormContext) => Promise<void>;
  handleClose: () => void;
}

export const FastFormContentConfirmModal: FC<Props> = ({ open, handleClose, onOrderSubmit }) => {
  const { formatMessage } = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mainForm, modalInfo } = useFastFormContext();
  const navigate = useNavigate();
  const currentCurrency = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!mainForm) throw new Error('mainFormData is null');
      await onOrderSubmit(mainForm);
      handleClose();
      navigate('/call-center/orders/list');
    } catch (error) {
      console.error('Error submitting form:', error);
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
            {formatMessage({ id: 'SYSTEM.FAST_FORM_DETAILS' })}
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
              {/* Application */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">
                  {formatMessage({ id: 'SYSTEM.APPLICATION_INFO' })}
                </h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.APPLICATION' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.client_type === 'legal'
                        ? mainForm.application.company_name
                        : formatFullName(
                            mainForm?.application?.first_name,
                            mainForm?.application?.last_name,
                            mainForm?.application?.patronymic
                          )}
                    </div>
                  </div>
                  {mainForm?.application?.client_type === 'legal' && (
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.BIN' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {mainForm?.application.bin || '-'}
                      </div>
                    </div>
                  )}
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.SOURCE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.source || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PHONE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.TYPE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.client_type || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.EMAIL' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.email || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.MESSAGE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.message || '-'}
                    </div>
                  </div>
                </div>
              </div>
              {/* Main */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">
                  {formatMessage({ id: 'SYSTEM.ORDER_INFO' })}
                </h4>
                <div className="grid gap-2.5">
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
                      {mainForm?.order?.delivery_category || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.INTERNATIONAL' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.is_international ? 'Enabled' : 'Disabled'}
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
                      {mainForm?.order?.order_content?.join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.CUSTOMS_CLEARANCE' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.customs_clearance ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.WEIGHT' })} (kg)
                    </label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.weight || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.WIDTH' })} (cm)
                    </label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.width || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.LENGTH' })} (cm)
                    </label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.length || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.HEIGHT' })} (cm)
                    </label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.height || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.VOLUME' })} (см³)
                    </label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.volume || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PLACES_COUNT' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.places_count || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PRICE' })} ({currentCurrency})
                    </label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.price || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.PACKAGE_DESCRIPTION' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.package_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.SPECIAL_WISHES' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.special_wishes || '-'}
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
                      {mainForm?.order?.sender?.type === 'legal'
                        ? mainForm?.order.sender.company_name
                        : formatFullName(
                            mainForm?.order?.sender?.first_name,
                            mainForm?.order?.sender?.last_name,
                            mainForm?.order?.sender?.patronymic
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
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.ADDRESS' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {[
                        mainForm?.order?.sender?.street,
                        mainForm?.order?.sender?.house,
                        mainForm?.order?.sender?.apartment
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
                      {mainForm?.order?.sender?.location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.NOTES' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.notes || '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Receiver */}
              <div className="">
                <h4 className="text-lg font-semibold mb-3">
                  {formatMessage({ id: 'SYSTEM.RECEIVER_INFO' })}
                </h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.receiver?.type === 'legal'
                        ? mainForm?.order.receiver.company_name
                        : formatFullName(
                            mainForm?.order?.receiver?.first_name,
                            mainForm?.order?.receiver?.last_name,
                            mainForm?.order?.receiver?.patronymic
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
                      {mainForm?.order?.receiver?.phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.ADDRESS' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {[
                        mainForm?.order?.receiver?.street,
                        mainForm?.order?.receiver?.house,
                        mainForm?.order?.receiver?.apartment
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
                      {mainForm?.order?.receiver?.location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {formatMessage({ id: 'SYSTEM.NOTES' })}
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.receiver?.notes || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <button
            className="btn btn-md btn-primary mr-3 mb-3"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'SYSTEM.SUBMIT' })}
          </button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

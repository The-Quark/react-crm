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

interface Props {
  open: boolean;
  onOrderSubmit: (mainFormData: IFastFormContext) => Promise<void>;
  handleClose: () => void;
}

export const FastFormContentConfirmModal: FC<Props> = ({ open, handleClose, onOrderSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mainForm } = useFastFormContext();
  const navigate = useNavigate();

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
              {/* Application */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">Application info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">
                      {mainForm?.application?.client_type === 'legal' ? 'Company' : 'Full name'}
                      Application
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
                      <label className="form-label max-w-56 text-gray-600">BIN</label>
                      <div className="flex columns-1 w-full">
                        {mainForm?.application.bin || '-'}
                      </div>
                    </div>
                  )}
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Source</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.source || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Type</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.client_type || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Email</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.email || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Message</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.application?.message || '-'}
                    </div>
                  </div>
                </div>
              </div>
              {/* Main */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3">Order info</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery type</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.delivery_type || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Delivery category</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.delivery_category || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">International</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.is_international ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Package Type</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.package_type || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Order content</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.order_content?.join(', ') || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Custom Clearance</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.customs_clearance ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Weight (kg)</label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.weight || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Width (m)</label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.width || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Length (m)</label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.length || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Height (m)</label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.height || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Volume</label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.volume || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Place count</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.places_count || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Price ($)</label>
                    <div className="flex columns-1 w-full">{mainForm?.order?.price || '-'}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Package description</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.package_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Special wishes</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.special_wishes || '-'}
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
                        mainForm?.order?.sender?.first_name,
                        mainForm?.order?.sender?.last_name,
                        mainForm?.order?.sender?.patronymic
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Country</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.country_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">City</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.city_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Address</label>
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
                      Location description
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Notes</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.sender?.notes || '-'}
                    </div>
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
                        mainForm?.order?.receiver?.first_name,
                        mainForm?.order?.receiver?.last_name,
                        mainForm?.order?.receiver?.patronymic
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Country</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.receiver?.country_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">City</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.receiver?.city_id || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Phone</label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.receiver?.phone || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Address</label>
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
                      Location description
                    </label>
                    <div className="flex columns-1 w-full">
                      {mainForm?.order?.receiver?.location_description || '-'}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56 text-gray-600">Notes</label>
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

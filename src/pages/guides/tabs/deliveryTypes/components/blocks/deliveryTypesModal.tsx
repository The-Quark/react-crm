import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { postDeliveryType, putDeliveryType, getDeliveryTypes } from '@/api';
import { IDeliveryTypeFormValues } from '@/api/post/postGuides/postDeliveryType/types.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DeliveryTypesResponse } from '@/api/get/getGuides/getDeliveryTypes/types.ts';
import { SharedError, SharedInput, SharedLoading, SharedTextArea } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object().shape({
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  description: Yup.string().optional()
});

const getInitialValues = (
  isEditMode: boolean,
  data: DeliveryTypesResponse
): IDeliveryTypeFormValues => {
  if (isEditMode && data?.result) {
    return {
      name: data.result[0].name || '',
      description: data.result[0].description || ''
    };
  }
  return {
    name: '',
    description: ''
  };
};

export const DeliveryTypesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: deliveryTypesData,
    isLoading: deliveryTypesLoading,
    isError: deliveryTypesIsError,
    error: deliveryTypesError
  } = useQuery({
    queryKey: ['formDeliveryTypes', id],
    queryFn: () => getDeliveryTypes({ id: Number(id) }),
    enabled: !!id && open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, deliveryTypesData as DeliveryTypesResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putDeliveryType(Number(id), values);
        } else {
          await postDeliveryType(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesDeliveryTypes'] });
      } catch (err) {
        console.error('Error submitting:', err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    queryClient.removeQueries({ queryKey: ['formDeliveryTypes'] });
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: id ? 'SYSTEM.UPDATE' : 'SYSTEM.CREATE' })}
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <button
            className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
            data-modal-dismiss="true"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </DialogHeader>
        <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
          {id && deliveryTypesIsError && <SharedError error={deliveryTypesError} />}
          {id && deliveryTypesLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput
                name="name"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedTextArea
                name="description"
                label={formatMessage({ id: 'SYSTEM.DESCRIPTION' })}
                formik={formik}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || formik.isSubmitting}
                >
                  {formatMessage({ id: loading ? 'SYSTEM.PLEASE_WAIT' : 'SYSTEM.SAVE' })}
                </button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

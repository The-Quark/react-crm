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
import { getBoxTypes, postBoxType, putBoxType } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import { decimalValidation } from '@/utils';
import { BoxType } from '@/api/get/getGuides/getBoxTypes/types.ts';
import { IBoxTypeFormValues } from '@/api/post/postGuides/postBoxType/types.ts';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  name: Yup.string().required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
  description: Yup.string().optional(),
  length: decimalValidation.required('VALIDATION.FORM_VALIDATION_FIRST_LENGTH_REQUIRED'),
  width: decimalValidation.required('VALIDATION.FORM_VALIDATION_FIRST_WIDTH_REQUIRED'),
  height: decimalValidation.required('VALIDATION.FORM_VALIDATION_FIRST_HEIGHT_REQUIRED')
});

const getInitialValues = (isEditMode: boolean, boxTypeData: BoxType): IBoxTypeFormValues => {
  if (isEditMode && boxTypeData) {
    const data = boxTypeData;
    return {
      name: data.name || '',
      description: data.description || '',
      height: data.height || '',
      length: data.length || '',
      width: data.width || ''
    };
  }
  return {
    name: '',
    description: '',
    height: '',
    length: '',
    width: ''
  };
};

const BoxTypeModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: boxTypeData,
    isLoading: boxTypLoading,
    isError: boxTypIsError,
    error: boxTypError
  } = useQuery({
    queryKey: ['guidesBoxType', id],
    queryFn: () => getBoxTypes({ id: Number(id) }),
    enabled: !!id && open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, boxTypeData?.result[0] as BoxType),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putBoxType(Number(id), values);
        } else {
          await postBoxType(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesBoxTypes'] });
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
    queryClient.removeQueries({ queryKey: ['guidesBoxTypes'] });
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: id ? 'SYSTEM.EDIT' : 'SYSTEM.CREATE' })}
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
          {id && boxTypIsError && <SharedError error={boxTypError} />}
          {id && boxTypLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput name="name" label="Name" formik={formik} />
              <SharedDecimalInput
                name="height"
                label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + '(cm)'}
                formik={formik}
              />
              <SharedDecimalInput
                name="width"
                label={formatMessage({ id: 'SYSTEM.WIDTH' }) + '(cm)'}
                formik={formik}
              />
              <SharedDecimalInput
                name="length"
                label={formatMessage({ id: 'SYSTEM.LENGTH' }) + '(cm)'}
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

export default BoxTypeModal;

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
import { ISourceFormValues } from '@/api/post/postGuides/postSource/types.ts';
import { postSource } from '@/api';
import { getSources } from '@/api/get';
import { putSource } from '@/api/put';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SourceResponse } from '@/api/get/getGuides/getSources/types.ts';
import { SharedCheckBox, SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  code: Yup.string().required('VALIDATION.CODE_REQUIRED'),
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  is_active: Yup.boolean().required('VALIDATION.ACTIVE_STATUS_REQUIRED')
});

const getInitialValues = (isEditMode: boolean, data: SourceResponse): ISourceFormValues => {
  if (isEditMode && data?.result) {
    return {
      name: data.result[0].name || '',
      code: data.result[0].code || '',
      is_active: data.result[0].is_active || true
    };
  }
  return {
    code: '',
    name: '',
    is_active: true
  };
};

const SourceModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['formSources', id],
    queryFn: () => getSources({ id: Number(id) }),
    enabled: !!id && open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, sourcesData as SourceResponse),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putSource(Number(id), values);
        } else {
          await postSource(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesSources'] });
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
    queryClient.removeQueries({ queryKey: ['formSources'] });
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
          {id && sourcesIsError && <SharedError error={sourcesError} />}
          {sourcesLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput
                name="name"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedInput
                name="code"
                label={formatMessage({ id: 'SYSTEM.CODE' })}
                formik={formik}
              />
              {!!id && (
                <SharedCheckBox
                  name="is_active"
                  label={formatMessage({ id: 'SYSTEM.ACTIVE' })}
                  formik={formik}
                />
              )}

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

export default SourceModal;

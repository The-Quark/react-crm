import React, { FC, Fragment, useState } from 'react';
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
import { ISourceFormValues } from '@/api/post/postSource/types.ts';
import { postSource } from '@/api';
import { getSources } from '@/api/get';
import { putSource } from '@/api/put';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SourceResponse } from '@/api/get/getSources/types.ts';
import { SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  code: Yup.string().required('Code is required'),
  name: Yup.string().required('Name is required'),
  is_active: Yup.boolean().required('Active status is required')
});

const getInitialValues = (isEditMode: boolean, data: SourceResponse): ISourceFormValues => {
  if (isEditMode && data?.result) {
    return {
      name: data.result[0].name || '',
      code: data.result[0].code || '',
      is_active: data.result[0].is_active || false
    };
  }
  return {
    code: '',
    name: '',
    is_active: false
  };
};

const SourceModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['formSources', id],
    queryFn: () => getSources(Number(id)),
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
    <Fragment>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
          <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
            <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
              {id ? 'Update' : 'Create'}
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
              <SharedLoading />
            ) : (
              <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
                <SharedInput name="name" label="Name" formik={formik} />
                <SharedInput name="code" label="Source code" formik={formik} />

                <div className="flex  flex-wrap items-center lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Active</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <div className="flex items-center gap-5">
                      <label className="checkbox-group flex items-center gap-2">
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="is_active"
                          checked={formik.values.is_active}
                          onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                        />
                      </label>
                    </div>
                    {formik.touched.is_active && formik.errors.is_active && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.is_active}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || formik.isSubmitting}
                  >
                    {loading ? 'Please wait...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default SourceModal;

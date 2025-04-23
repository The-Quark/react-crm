import React, { FC, Fragment, useEffect, useState } from 'react';
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
import { CircularProgress } from '@mui/material';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
}

const validationSchema = Yup.object().shape({
  code: Yup.string().required('Code is required'),
  name: Yup.string().required('Name is required'),
  is_active: Yup.boolean().required('Active status is required')
});

const SourceModal: FC<Props> = ({ open, onOpenChange, setReload, id }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ISourceFormValues>({
    code: '',
    name: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      const fetchReq = async () => {
        setFormLoading(true);
        try {
          const reqData = await getSources(Number(id));
          const req = reqData.result[0];
          setInitialValues({
            code: req.code,
            name: req.name,
            is_active: req.is_active
          });
          setFormLoading(false);
        } catch (err) {
          console.error('Request error:', err);
        } finally {
          setFormLoading(false);
        }
      };

      fetchReq();
    }
  }, [id]);

  const formik = useFormik({
    initialValues,
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
        setReload((prev) => !prev);
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
            {formLoading ? (
              <div className="flex justify-center items-center p-5">
                <CircularProgress />
              </div>
            ) : (
              <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Name</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Name"
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Source code</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Source code"
                      {...formik.getFieldProps('code')}
                    />
                    {formik.touched.code && formik.errors.code && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.code}
                      </span>
                    )}
                  </div>
                </div>

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

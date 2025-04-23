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
import { ILanguageFormValues } from '@/api/post/postLanguage/types.ts';
import { postLanguage } from '@/api';
import { getLanguages } from '@/api/get/getLanguages';
import { putLanguage } from '@/api/put';
import { CircularProgress } from '@mui/material';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
}

const createLanguageSchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .matches(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid code format (e.g., en or en-US)'),
  name: Yup.string().required('Name is required'),
  native_name: Yup.string().required('Native name is required'),
  locale: Yup.string().required('Locale is required'),
  direction: Yup.mixed<'ltr' | 'rtl'>()
    .oneOf(['ltr', 'rtl'], 'Direction must be either "ltr" or "rtl"')
    .required('Direction is required'),
  is_active: Yup.boolean().required('Active status is required')
});

const PackagesModal: FC<Props> = ({ open, onOpenChange, setReload, id }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ILanguageFormValues>({
    code: '',
    name: '',
    native_name: '',
    locale: '',
    direction: 'ltr',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      const fetchLanguage = async () => {
        setFormLoading(true);
        try {
          const languageData = await getLanguages(Number(id));
          const lang = languageData.result[0];
          setInitialValues({
            code: lang.code,
            name: lang.name,
            native_name: lang.native_name,
            locale: lang.locale,
            direction: lang.direction,
            is_active: lang.is_active
          });
          setFormLoading(false);
        } catch (err) {
          console.error('Request error:', err);
        } finally {
          setFormLoading(false);
        }
      };

      fetchLanguage();
    }
  }, [id]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createLanguageSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putLanguage(Number(id), values);
        } else {
          await postLanguage(values);
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
              {id ? 'Update language' : 'New language'}
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
                  <label className="form-label max-w-56">Native name</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Native name"
                      {...formik.getFieldProps('native_name')}
                    />
                    {formik.touched.native_name && formik.errors.native_name && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.native_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Language code</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Language code"
                      {...formik.getFieldProps('code')}
                    />
                    {formik.touched.code && formik.errors.code && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.code}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Locale</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Locale"
                      {...formik.getFieldProps('locale')}
                    />
                    {formik.touched.locale && formik.errors.locale && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.locale}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex  flex-wrap items-center lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Direction</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <div className="flex items-center gap-5">
                      <label className="radio-group">
                        <input
                          className="radio-sm"
                          type="radio"
                          name="direction"
                          value="ltr"
                          checked={formik.values.direction === 'ltr'}
                          onChange={formik.handleChange}
                        />
                        <span className="radio-label">LTR</span>
                      </label>
                      <label className="radio-group">
                        <input
                          className="radio-sm"
                          type="radio"
                          name="direction"
                          value="rtl"
                          checked={formik.values.direction === 'rtl'}
                          onChange={formik.handleChange}
                        />
                        <span className="radio-label">RTL</span>
                      </label>
                    </div>
                    {formik.touched.direction && formik.errors.direction && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.direction}
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

export default PackagesModal;

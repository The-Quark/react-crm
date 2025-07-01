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
import { ILanguageFormValues } from '@/api/post/postGuides/postLanguage/types.ts';
import { postLanguage } from '@/api';
import { getLanguages } from '@/api/get/getGuides/getLanguages';
import { putLanguage } from '@/api/put';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LanguageResponse } from '@/api/get/getGuides/getLanguages/types.ts';
import { SharedCheckBox, SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object().shape({
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

const getInitialValues = (isEditMode: boolean, data: LanguageResponse): ILanguageFormValues => {
  if (isEditMode && data?.result) {
    return {
      code: data.result[0].code || '',
      name: data.result[0].name || '',
      native_name: data.result[0].native_name || '',
      locale: data.result[0].locale || '',
      direction: data.result[0].direction || 'ltr',
      is_active: data.result[0].is_active || false
    };
  }
  return {
    code: '',
    name: '',
    native_name: '',
    locale: '',
    direction: 'ltr',
    is_active: true
  };
};

const LanguagesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: languageData,
    isLoading: languageLoading,
    isError: languageIsError,
    error: languageError
  } = useQuery({
    queryKey: ['formLanguage', id],
    queryFn: () => getLanguages({ id: Number(id) }),
    enabled: !!id && open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, languageData as LanguageResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
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
        queryClient.invalidateQueries({ queryKey: ['guidesLanguages'] });
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
    queryClient.removeQueries({ queryKey: ['formLanguage'] });
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
          {id && languageIsError && <SharedError error={languageError} />}
          {id && languageLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput
                name="name"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedInput
                name="native_name"
                label={formatMessage({ id: 'SYSTEM.NATIVE_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="code"
                label={formatMessage({ id: 'SYSTEM.LANGUAGE_CODE' })}
                formik={formik}
              />
              <SharedInput
                name="locale"
                label={formatMessage({ id: 'SYSTEM.LOCALE' })}
                formik={formik}
              />

              <div className="flex  flex-wrap items-center lg:flex-nowrap gap-2.5">
                <label className="form-label max-w-56">
                  {formatMessage({ id: 'SYSTEM.DIRECTION' })}
                </label>
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
                      <span className="radio-label"> {formatMessage({ id: 'SYSTEM.LTR' })}</span>
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
                      <span className="radio-label">{formatMessage({ id: 'SYSTEM.RTL' })}</span>
                    </label>
                  </div>
                  {formik.touched.direction && formik.errors.direction && (
                    <span role="alert" className="text-danger text-xs mt-1">
                      {formatMessage({ id: formik.errors.direction })}
                    </span>
                  )}
                </div>
              </div>
              <SharedCheckBox
                name="is_active"
                label={formatMessage({ id: 'SYSTEM.ACTIVE' })}
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

export default LanguagesModal;

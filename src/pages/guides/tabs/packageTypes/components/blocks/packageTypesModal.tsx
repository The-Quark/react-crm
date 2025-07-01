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
import { postPackageType, putPackageType, getPackageTypes } from '@/api';
import { CircularProgress } from '@mui/material';
import { IPackageTypeFormValues } from '@/api/post/postGuides/postPackageType/types.ts';
import { useQueryClient } from '@tanstack/react-query';
import { SharedCheckBox, SharedInput, SharedSelect, SharedTextArea } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

interface Language {
  code: string;
  name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
  languages: Language[];
  selectedLanguage: string;
}

const validateSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, 'VALIDATION.CODE_FORMAT_ALPHANUMERIC_UNDERSCORE')
    .required('VALIDATION.CODE_REQUIRED'),
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  language_code: Yup.string().required('VALIDATION.LANGUAGE_CODE_REQUIRED'),
  description: Yup.string().notRequired(),
  is_active: Yup.boolean().required('VALIDATION.ACTIVE_STATUS_REQUIRED')
});

const PackageTypesModal: FC<Props> = ({ open, onOpenChange, id, languages, selectedLanguage }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<IPackageTypeFormValues>({
    code: '',
    name: '',
    language_code: selectedLanguage,
    description: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      const fetchReq = async () => {
        setFormLoading(true);
        try {
          const reqData = await getPackageTypes({ id: Number(id) });
          const req = reqData.result[0];
          setInitialValues({
            code: req.code,
            name: req.language[0].name,
            language_code: selectedLanguage,
            description: req.language[0].description || '',
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
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putPackageType(Number(id), values);
        } else {
          await postPackageType(values);
        }
        resetForm();
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ['package-types'] });
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
    onOpenChange(false);
  };

  return (
    <Fragment>
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
            {formLoading ? (
              <div className="flex justify-center items-center p-5">
                <CircularProgress />
              </div>
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

                <SharedSelect
                  name="language_code"
                  label={formatMessage({ id: 'SYSTEM.LANGUAGES_CODE' })}
                  formik={formik}
                  options={languages.map((language) => ({
                    label: language.name,
                    value: language.code
                  }))}
                />

                <SharedTextArea
                  name="description"
                  label={formatMessage({ id: 'SYSTEM.DESCRIPTION' })}
                  formik={formik}
                />
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
    </Fragment>
  );
};

export default PackageTypesModal;

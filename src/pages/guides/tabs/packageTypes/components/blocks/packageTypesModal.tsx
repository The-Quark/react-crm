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
import { IPackageTypeFormValues } from '@/api/post/postPackageType/types.ts';
import { useQueryClient } from '@tanstack/react-query';
import { SharedInput, SharedSelect } from '@/partials/sharedUI';

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
    .matches(/^[A-Za-z0-9_]+$/, 'Code can only contain letters, numbers, and underscores')
    .required('Code is required'),
  name: Yup.string().required('Name is required'),
  language_code: Yup.string().required('Language code is required'),
  description: Yup.string().notRequired(),
  is_active: Yup.boolean().required('Active status is required')
});

const PackageTypesModal: FC<Props> = ({ open, onOpenChange, id, languages, selectedLanguage }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<IPackageTypeFormValues>({
    code: '',
    name: '',
    language_code: selectedLanguage,
    description: '',
    is_active: true
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (id) {
      const fetchReq = async () => {
        setFormLoading(true);
        try {
          const reqData = await getPackageTypes(Number(id), undefined);
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
                <SharedInput name="name" label="Name" formik={formik} />
                <SharedInput name="code" label="Code" formik={formik} />

                <SharedSelect
                  name="language_code"
                  label="Language code"
                  formik={formik}
                  options={languages.map((language) => ({
                    label: language.name,
                    value: language.code
                  }))}
                />

                <SharedInput name="description" label="Description" formik={formik} />

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

export default PackageTypesModal;

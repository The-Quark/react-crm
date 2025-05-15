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
import { IGlobalParamsPositionFormValues } from '@/api/post/postGlobalParamsPosition/types.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IGlobalParamsPositionModel } from '@/api/get/getGlobalParamsPositions/types.ts';
import { SharedAutocomplete, SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';
import {
  getGlobalParameters,
  getGlobalParamsPositions,
  postGlobalParamsPosition,
  putGlobalParamsPosition
} from '@/api';
import { Textarea } from '@/components/ui/textarea.tsx';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  company_id: Yup.string().required('Company is required'),
  description: Yup.string().optional(),
  is_active: Yup.boolean().required('Active status is required')
});

const getInitialValues = (
  isEditMode: boolean,
  data: IGlobalParamsPositionModel
): IGlobalParamsPositionFormValues => {
  if (isEditMode && data?.result) {
    return {
      title: data.result[0].title || '',
      company_id: data.result[0].company_id || '',
      description: data.result[0].description || '',
      is_active: data.result[0].is_active || true
    };
  }
  return {
    title: '',
    company_id: '',
    description: '',
    is_active: true
  };
};

export const PositionsModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const queryClient = useQueryClient();

  const {
    data: positionsData,
    isLoading: positionsLoading,
    isError: positionsIsError,
    error: positionsError
  } = useQuery({
    queryKey: ['formPositions', id],
    queryFn: () => getGlobalParamsPositions(Number(id)),
    enabled: !!id && open
  });

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['positionsCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, positionsData as IGlobalParamsPositionModel),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putGlobalParamsPosition(Number(id), values);
        } else {
          await postGlobalParamsPosition(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['globalParamsPositions'] });
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
    queryClient.removeQueries({ queryKey: ['formPositions'] });
    onOpenChange();
  };

  return (
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
          {companyIsError && <SharedError error={companyError} />}
          {id && positionsIsError && <SharedError error={positionsError} />}
          {positionsLoading || companyLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedAutocomplete
                label="Company"
                value={formik.values.company_id}
                options={
                  companyData?.result.map((item) => ({ ...item, name: item.company_name })) ?? []
                }
                placeholder="Select company"
                searchPlaceholder="Search company"
                onChange={(val) => {
                  formik.setFieldValue('company_id', val);
                }}
                error={formik.errors.company_id as string}
                touched={formik.touched.company_id}
                searchTerm={searchCompanyTerm}
                onSearchTermChange={setSearchCompanyTerm}
              />
              <SharedInput name="title" label="Title" formik={formik} />

              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label className="form-label max-w-56">Description</label>
                <div className="flex columns-1 w-full flex-wrap">
                  <Textarea
                    rows={4}
                    placeholder="Description"
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <span role="alert" className="text-danger text-xs mt-1">
                      {formik.errors.description}
                    </span>
                  )}
                </div>
              </div>

              {!!id && (
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
              )}

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
  );
};

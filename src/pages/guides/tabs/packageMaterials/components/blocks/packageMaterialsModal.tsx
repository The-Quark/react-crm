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
import {
  getGlobalParameters,
  getPackageMaterials,
  getUnits,
  postPackageMaterial,
  putPackageMaterial
} from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedError,
  SharedInput,
  SharedLoading,
  SharedMultiSelect,
  SharedSelect
} from '@/partials/sharedUI';
import { PackageMaterialResponse } from '@/api/get/getPackageMaterials/types.ts';
import { IPackageMaterialFormValues } from '@/api/post/postPackageMaterial/types.ts';
import { Textarea } from '@/components/ui/textarea.tsx';
import { decimalValidation } from '@/utils';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  company_id: Yup.array()
    .min(1, 'At least one company must be selected')
    .required('Company is required'),
  unit_id: Yup.number().required('Unit is required'),
  code: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, 'Only letters, numbers and underscores are allowed')
    .required('Code is required')
    .max(10, 'Maximum length is 10 characters'),
  name: Yup.string().required('Name is required'),
  price: decimalValidation.required('Price is required'),
  description: Yup.string().nullable(),
  is_active: Yup.boolean().required('Active status is required')
});

const getInitialValues = (
  isEditMode: boolean,
  packageMaterialData: PackageMaterialResponse
): IPackageMaterialFormValues => {
  if (isEditMode && packageMaterialData?.result) {
    return {
      name: packageMaterialData.result[0].name || '',
      code: packageMaterialData.result[0].code || '',
      description: packageMaterialData.result[0].description || '',
      price: Number(packageMaterialData.result[0].price) || 0,
      unit_id: packageMaterialData.result[0].unit_id || '',
      company_id: packageMaterialData.result[0].company.map((c) => c.id) || [],
      is_active: packageMaterialData.result[0].is_active || true
    };
  }
  return {
    name: '',
    code: '',
    description: '',
    price: 0,
    unit_id: '',
    company_id: [],
    is_active: true
  };
};

const PackageMaterialsModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: packageMaterialData,
    isLoading: packageMaterialLoading,
    isError: packageMaterialIsError,
    error: packageMaterialError
  } = useQuery({
    queryKey: ['formPackageMaterial', id],
    queryFn: () => getPackageMaterials(Number(id)),
    enabled: !!id && open
  });

  const {
    data: unitsData,
    isLoading: unitsLoading,
    isError: unitsIsError,
    error: unitsError
  } = useQuery({
    queryKey: ['guidesPackageMaterialsUnits'],
    queryFn: () => getUnits(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false
  });

  const {
    data: companiesData,
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesError
  } = useQuery({
    queryKey: ['guidesPackageMaterialsCompanies'],
    queryFn: () => getGlobalParameters(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, packageMaterialData as PackageMaterialResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const payload = {
          ...values
        };

        if (id) {
          await putPackageMaterial(Number(id), payload);
        } else {
          await postPackageMaterial(payload);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['packageMaterials'] });
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
    queryClient.removeQueries({ queryKey: ['formPackageMaterial'] });
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {id ? 'Update' : 'Create'} Package Material
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
          {unitsIsError && <SharedError error={unitsError} />}
          {companiesIsError && <SharedError error={companiesError} />}
          {id && packageMaterialIsError && <SharedError error={packageMaterialError} />}
          {unitsLoading || companiesLoading || (id && packageMaterialLoading) ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput name="name" label="Name" formik={formik} />
              <SharedInput name="code" label="Code" formik={formik} />
              <SharedInput name="price" label="Price" formik={formik} type="decimal" />
              <SharedSelect
                name="unit_id"
                label="Select unit"
                formik={formik}
                options={
                  unitsData?.result?.map((unit) => ({
                    label: `${unit.code} - ${unit.name}`,
                    value: unit.id
                  })) ?? []
                }
                placeholder="Select unit"
              />

              <SharedMultiSelect
                selectedValues={formik.values.company_id.map(String)}
                onChange={(values) => formik.setFieldValue('company_id', values)}
                placeholder="Select company..."
                searchPlaceholder="Search company..."
                label="Company"
                error={formik.errors.company_id as string}
                touched={formik.touched.company_id}
                options={
                  companiesData?.result?.map((app) => ({
                    value: String(app.id),
                    label: app.company_name
                  })) ?? []
                }
              />

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
                <div className="flex flex-wrap items-center lg:flex-nowrap gap-2.5">
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
                        <span>Active</span>
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

              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-outline" onClick={handleClose}>
                  Cancel
                </button>
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

export default PackageMaterialsModal;

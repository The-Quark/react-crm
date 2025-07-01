import React, { FC, useMemo, useState } from 'react';
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
  SharedCheckBox,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedMultiSelect,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { PackageMaterialResponse } from '@/api/get/getGuides/getPackageMaterials/types.ts';
import { IPackageMaterialFormValues } from '@/api/post/postGuides/postPackageMaterial/types.ts';
import { CACHE_TIME, decimalValidation } from '@/utils';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  company_id: Yup.array().min(1, 'VALIDATION.COMPANY_MIN').required('VALIDATION.COMPANY_REQUIRED'),
  unit_id: Yup.number().required('VALIDATION.UNIT_REQUIRED'),
  code: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, 'VALIDATION.CODE_FORMAT_ALPHANUMERIC_UNDERSCORE')
    .required('VALIDATION.CODE_REQUIRED')
    .max(10, 'VALIDATION.CODE_MAX'),
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  price: decimalValidation.required('VALIDATION.PRICE_REQUIRED'),
  description: Yup.string().nullable(),
  is_active: Yup.boolean().required('VALIDATION.ACTIVE_STATUS_REQUIRED')
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
      price: packageMaterialData.result[0].price || '',
      unit_id: packageMaterialData.result[0].unit_id || '',
      company_id: packageMaterialData.result[0].company.map((c) => String(c.id)) || [],
      is_active: packageMaterialData.result[0].is_active || true
    };
  }
  return {
    name: '',
    code: '',
    description: '',
    price: '',
    unit_id: '',
    company_id: [],
    is_active: true
  };
};

const PackageMaterialsModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: packageMaterialData,
    isLoading: packageMaterialLoading,
    isError: packageMaterialIsError,
    error: packageMaterialError
  } = useQuery({
    queryKey: ['formPackageMaterial', id],
    queryFn: () => getPackageMaterials({ id: Number(id) }),
    enabled: !!id && open
  });

  const {
    data: unitsData,
    isLoading: unitsLoading,
    isError: unitsIsError,
    error: unitsError
  } = useQuery({
    queryKey: ['guidesPackageMaterialsUnits'],
    queryFn: () => getUnits({}),
    staleTime: CACHE_TIME,
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
    staleTime: CACHE_TIME,
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

  const companiesOptions = useMemo(() => {
    return (
      companiesData?.result?.map((company) => ({
        id: company.id.toString(),
        name: company.company_name
      })) || []
    );
  }, [companiesData]);

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
          {unitsIsError && <SharedError error={unitsError} />}
          {companiesIsError && <SharedError error={companiesError} />}
          {id && packageMaterialIsError && <SharedError error={packageMaterialError} />}
          {unitsLoading || companiesLoading || (id && packageMaterialLoading) ? (
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
              <SharedDecimalInput
                name="price"
                label={formatMessage({ id: 'SYSTEM.PRICE' })}
                formik={formik}
              />
              <SharedSelect
                name="unit_id"
                label={formatMessage({ id: 'SYSTEM.UNIT' })}
                formik={formik}
                options={
                  unitsData?.result?.map((unit) => ({
                    label: `${unit.code} - ${unit.name}`,
                    value: unit.id
                  })) ?? []
                }
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_UNIT' })}
              />
              <SharedMultiSelect
                label={formatMessage({ id: 'SYSTEM.COMPANY' })}
                selectedValues={
                  packageMaterialData?.result[0].company.map((c) => String(c.id)) ||
                  formik.values.company_id
                }
                onChange={(values) => formik.setFieldValue('company_id', values)}
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_COMPANY' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COMPANY' })}
                options={companiesOptions.map((company) => ({
                  value: company.id,
                  label: company.name
                }))}
                error={formik.errors.company_id as string}
                touched={formik.touched.company_id}
                modalPopover
              />

              <SharedTextArea
                name="description"
                label={formatMessage({ id: 'SYSTEM.DESCRIPTION' })}
                formik={formik}
              />

              {!!id && (
                <SharedCheckBox
                  name="is_active"
                  label={formatMessage({ id: 'SYSTEM.ACTIVE' })}
                  formik={formik}
                />
              )}

              <div className="flex justify-end gap-3">
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

export default PackageMaterialsModal;

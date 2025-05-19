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
import { IGlobalParamsSubdivisionFormValues } from '@/api/post/postGlobalParamsSubdivision/types.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ISubdivisionResponse } from '@/api/get/getGlobalParamsSubdivisions/types.ts';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import {
  getCurrencies,
  getGlobalParameters,
  getGlobalParamsSubdivisions,
  getLanguages,
  postGlobalParamsSubdivision,
  putGlobalParamsSubdivisions
} from '@/api';
import { timezoneMock } from '@/lib/mocks.ts';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company_id: Yup.string().required('Company is required'),
  language_id: Yup.string().required('Language is required'),
  currency_id: Yup.string().required('Currency is required'),
  is_active: Yup.boolean().required('Active status is required')
});

const getInitialValues = (
  isEditMode: boolean,
  data: ISubdivisionResponse
): IGlobalParamsSubdivisionFormValues => {
  if (isEditMode && data?.result) {
    return {
      name: data.result[0].name || '',
      timezone: data.result[0].timezone || '',
      warehouse_address: data.result[0].warehouse_address || '',
      legal_address: data.result[0].legal_address || '',
      company_id: data.result[0].company_id || '',
      language_id: data.result[0].language_id || '',
      currency_id: data.result[0].currency_id || '',
      is_active: data.result[0].is_active || true
    };
  }
  return {
    name: '',
    timezone: '',
    warehouse_address: '',
    legal_address: '',
    company_id: '',
    language_id: '',
    currency_id: '',
    is_active: true
  };
};

export const SubdivisionModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const [searchLanguageTerm, setSearchLanguageTerm] = useState('');
  const [searchCurrencyTerm, setSearchCurrencyTerm] = useState('');
  const queryClient = useQueryClient();

  const {
    data: subdivisionsData,
    isLoading: subdivisionsLoading,
    isError: subdivisionsIsError,
    error: subdivisionsError
  } = useQuery({
    queryKey: ['formSubdivisions', id],
    queryFn: () => getGlobalParamsSubdivisions(Number(id)),
    enabled: !!id && open
  });

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['subdivisionsCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const {
    data: currencyData,
    isLoading: currencyLoading,
    isError: currencyIsError,
    error: currencyError
  } = useQuery({
    queryKey: ['subdivisionsCurrency'],
    queryFn: () => getCurrencies(),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const {
    data: languageData,
    isLoading: languageLoading,
    isError: languageIsError,
    error: languageError
  } = useQuery({
    queryKey: ['subdivisionsLanguage'],
    queryFn: () => getLanguages(),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, subdivisionsData as ISubdivisionResponse),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putGlobalParamsSubdivisions(Number(id), values);
        } else {
          await postGlobalParamsSubdivision(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['globalParamsSubdivisions'] });
        setSearchCompanyTerm('');
        setSearchLanguageTerm('');
        setSearchCurrencyTerm('');
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
    queryClient.removeQueries({ queryKey: ['formSubdivisions'] });
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
          {languageIsError && <SharedError error={languageError} />}
          {currencyIsError && <SharedError error={currencyError} />}
          {id && subdivisionsIsError && <SharedError error={subdivisionsError} />}
          {subdivisionsLoading || companyLoading || languageLoading || currencyLoading ? (
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
              <SharedInput name="name" label="Name" formik={formik} />

              <SharedAutocomplete
                label="Language"
                value={formik.values.language_id}
                options={languageData?.result.map((item) => ({ ...item, name: item.name })) ?? []}
                placeholder="Select language"
                searchPlaceholder="Search language"
                onChange={(val) => {
                  formik.setFieldValue('language_id', val);
                }}
                error={formik.errors.language_id as string}
                touched={formik.touched.language_id}
                searchTerm={searchLanguageTerm}
                onSearchTermChange={setSearchLanguageTerm}
              />

              <SharedAutocomplete
                label="Currency"
                value={formik.values.currency_id}
                options={currencyData?.result.map((item) => ({ ...item, name: item.name })) ?? []}
                placeholder="Select currency"
                searchPlaceholder="Search currency"
                onChange={(val) => {
                  formik.setFieldValue('currency_id', val);
                }}
                error={formik.errors.currency_id as string}
                touched={formik.touched.currency_id}
                searchTerm={searchCurrencyTerm}
                onSearchTermChange={setSearchCurrencyTerm}
              />

              <SharedSelect
                name="timezone"
                label="Time zone"
                formik={formik}
                options={timezoneMock.map((tz) => ({ label: tz.timezone, value: tz.timezone }))}
              />

              <SharedInput name="legal_address" label="Legal Address" formik={formik} />
              <SharedInput name="warehouse_address" label="Warehouse Address" formik={formik} />

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

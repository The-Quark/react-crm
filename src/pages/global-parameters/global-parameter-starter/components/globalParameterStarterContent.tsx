import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useLanguage } from '@/i18n';
import { timezoneMock } from '@/lib/mocks.ts';
import {
  getCurrencies,
  getLanguages,
  postGlobalParameter,
  putGlobalParameter,
  getGlobalParameters,
  getAirlines
} from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedAutocomplete, SharedError, SharedLoading } from '@/partials/sharedUI';
import { useParams } from 'react-router';

const createParameterSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  timezone: Yup.string().required('Timezone is required'),
  currency: Yup.string().required('Currency is required'),
  language: Yup.string().required('Language is required'),
  legal_address: Yup.string().required('Legal address is required'),
  warehouse_address: Yup.string().required('Warehouse address is required'),
  airlines: Yup.string().required('Airlines is required'),
  dimensions_per_place: Yup.string().required('Dimensions per place is required'),
  cost_per_airplace: Yup.number().required('Cost per airplace is required')
});

interface IParameterFormValues {
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  airlines: string;
  dimensions_per_place: string;
  cost_per_airplace: number;
}

export const GlobalParameterStarterContent = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { currentLanguage } = useLanguage();

  const {
    data: cuurencyData,
    isLoading: loadingCurrencies,
    isError: isCurrenciesError,
    error: currenciesErrorMessage
  } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => getCurrencies(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: languagesData,
    isLoading: loadingLanguages,
    isError: isLanguagesError,
    error: languagesErrorMessage
  } = useQuery({
    queryKey: ['languages'],
    queryFn: () => getLanguages(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: parameterData,
    isLoading: loadingParameter,
    isError: isParameterError,
    error: parameterErrorMessage
  } = useQuery({
    queryKey: ['global-parameter', id],
    queryFn: () => getGlobalParameters(id ? parseInt(id) : undefined),
    enabled: isEditMode,
    retry: false,
    refetchOnWindowFocus: false
  });

  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['globalParameterAirlines'],
    queryFn: () => getAirlines()
  });

  const initialValues: IParameterFormValues = {
    company_name: '',
    timezone: '',
    currency: localStorage.getItem('app_currency') || 'USD',
    language: currentLanguage.code,
    legal_address: '',
    warehouse_address: '',
    airlines: '',
    dimensions_per_place: '',
    cost_per_airplace: 0
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createParameterSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && id) {
          await putGlobalParameter(Number(id), {
            ...values,
            airlines: String(values.airlines)
          });
        } else {
          await postGlobalParameter({ ...values, airlines: String(values.airlines) });
          resetForm();
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  useEffect(() => {
    if (parameterData && isEditMode) {
      formik.setValues({
        company_name: parameterData.result[0].company_name ?? '',
        timezone: parameterData.result[0].timezone ?? '',
        currency: parameterData.result[0].currency ?? '',
        language: parameterData.result[0].language ?? '',
        legal_address: parameterData.result[0].legal_address ?? '',
        warehouse_address: parameterData.result[0].warehouse_address ?? '',
        airlines: parameterData.result[0].airlines ?? '',
        dimensions_per_place: parameterData.result[0].dimensions_per_place ?? '',
        cost_per_airplace: parseFloat(parameterData.result[0].cost_per_airplace) ?? 0
      });
    }
  }, [parameterData, isEditMode]);

  if (isParameterError) {
    return <SharedError error={parameterErrorMessage} />;
  }

  if (isLanguagesError) {
    return <SharedError error={languagesErrorMessage} />;
  }

  if (isCurrenciesError) {
    return <SharedError error={currenciesErrorMessage} />;
  }
  if (airlinesIsError) {
    return <SharedError error={airlinesError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      {loadingCurrencies || loadingLanguages || loadingParameter || airlinesLoading ? (
        <SharedLoading />
      ) : (
        <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
          <div className="card-header" id="general_settings">
            <h3 className="card-title">Parameter</h3>
          </div>
          <div className="card-body grid gap-5">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Company Name</label>
              <div className="flex columns-1 w-full flex-wrap">
                <input
                  className="input w-full"
                  type="text"
                  placeholder="Company Name"
                  {...formik.getFieldProps('company_name')}
                />
                {formik.touched.company_name && formik.errors.company_name && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.company_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Time zone</label>
              <div className="flex columns-1 w-full flex-wrap">
                <Select
                  value={formik.values.timezone}
                  onValueChange={(value) => formik.setFieldValue('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time Zone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {timezoneMock.map((tz) => (
                      <SelectItem key={tz.key} value={tz.timezone}>
                        {tz.timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.timezone && formik.errors.timezone && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.timezone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Currency</label>
              <div className="flex columns-1 w-full flex-wrap">
                <Select
                  value={formik.values.currency?.toString()}
                  onValueChange={(value) => formik.setFieldValue('currency', String(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {cuurencyData?.result.map((currency) => (
                      <SelectItem key={currency.id} value={currency.code}>
                        {currency.name} — {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.currency && formik.errors.currency && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.currency}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Language</label>
              <div className="flex columns-1 w-full flex-wrap">
                <Select
                  value={formik.values.language?.toString()}
                  onValueChange={(value) => formik.setFieldValue('language', String(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {languagesData?.result.map((language) => (
                      <SelectItem key={language.id} value={language.code}>
                        {language.name} - {language.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.language && formik.errors.language && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.language}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Legal Address</label>
              <div className="flex columns-1 w-full flex-wrap">
                <input
                  className="input w-full"
                  type="text"
                  placeholder="Legal Address"
                  {...formik.getFieldProps('legal_address')}
                />
                {formik.touched.legal_address && formik.errors.legal_address && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.legal_address}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Warehouse Address</label>
              <div className="flex columns-1 w-full flex-wrap">
                <input
                  className="input w-full"
                  type="text"
                  placeholder="Warehouse Address"
                  {...formik.getFieldProps('warehouse_address')}
                />
                {formik.touched.warehouse_address && formik.errors.warehouse_address && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.warehouse_address}
                  </span>
                )}
              </div>
            </div>

            <SharedAutocomplete
              label="Airlines"
              value={formik.values.airlines}
              options={airlinesData?.result ?? []}
              placeholder="Select airline"
              searchPlaceholder="Search airline"
              onChange={(val) => {
                formik.setFieldValue('airlines', val);
              }}
              error={formik.errors.airlines as string}
              touched={formik.touched.airlines}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Dimension Per Place</label>
              <div className="flex columns-1 w-full flex-wrap">
                <input
                  className="input w-full"
                  type="text"
                  placeholder="Dimension Per Place"
                  {...formik.getFieldProps('dimensions_per_place')}
                />
                {formik.touched.dimensions_per_place && formik.errors.dimensions_per_place && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.dimensions_per_place}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Cost Per Airplace</label>
              <div className="flex columns-1 w-full flex-wrap">
                <input
                  className="input w-full"
                  type="number"
                  placeholder="Cost Per Airplace"
                  {...formik.getFieldProps('cost_per_airplace')}
                />
                {formik.touched.cost_per_airplace && formik.errors.cost_per_airplace && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.cost_per_airplace}
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
          </div>
        </form>
      )}
    </div>
  );
};

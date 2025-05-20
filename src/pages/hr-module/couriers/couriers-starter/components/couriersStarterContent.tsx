import React, { useEffect, useMemo, useState } from 'react';
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
import { SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';
import { useParams, useNavigate } from 'react-router';
import { SharedMultipleSelect } from '@/partials/sharedUI/sharedMultipleSelect.tsx';

const createParameterSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  timezone: Yup.string().required('Timezone is required'),
  currency: Yup.string().required('Currency is required'),
  language: Yup.string().required('Language is required'),
  legal_address: Yup.string().required('Legal address is required'),
  warehouse_address: Yup.string().required('Warehouse address is required'),
  airlines: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one airline must be selected')
    .required('Airlines is required'),
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
  airlines: string[];
  dimensions_per_place: string;
  cost_per_airplace: number;
}

export const CouriersStarterContent = () => {
  const [loading, setLoading] = useState(false);
  const { currentLanguage } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
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
    queryFn: () => getAirlines(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const selectedAirlines = useMemo(() => {
    if (!parameterData || !isEditMode) return [];
    return parameterData.result[0]?.airlines || [];
  }, [parameterData, isEditMode]);

  const airlineOptions = useMemo(() => {
    return (
      airlinesData?.result?.map((airline) => ({
        id: airline.id.toString(),
        name: airline.name
      })) || []
    );
  }, [airlinesData]);

  const selectedAirlineIds = useMemo(() => {
    return selectedAirlines.map((airline) => airline.id.toString());
  }, [selectedAirlines]);

  const initialValues: IParameterFormValues = {
    company_name: '',
    timezone: '',
    currency: localStorage.getItem('app_currency') || 'USD',
    language: currentLanguage.code,
    legal_address: '',
    warehouse_address: '',
    airlines: [],
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
            airlines: values.airlines
          });
          navigate('/global-parameters/list');
        } else {
          await postGlobalParameter(values);
          resetForm();
          navigate('/global-parameters/list');
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
        airlines: selectedAirlineIds,
        dimensions_per_place: parameterData.result[0].dimensions_per_place ?? '',
        cost_per_airplace: parseFloat(parameterData.result[0].cost_per_airplace) ?? 0
      });
    }
  }, [parameterData, isEditMode, selectedAirlineIds]);

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
            <h3 className="card-title">Global Parameter</h3>
          </div>
          <div className="card-body grid gap-5">
            <SharedInput name="company_name" label="Company Name" formik={formik} />

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

            <SharedInput name="legal_address" label="Legal Address" formik={formik} />

            <SharedInput name="warehouse_address" label="Warehouse Address" formik={formik} />

            <SharedMultipleSelect
              label="Airlines"
              value={formik.values.airlines}
              options={airlineOptions}
              onChange={(values) => formik.setFieldValue('airlines', values)}
              placeholder="Select airlines..."
              searchPlaceholder="Search airlines..."
              loading={airlinesLoading}
              error={formik.errors.airlines as string}
              touched={formik.touched.airlines}
            />

            <SharedInput name="dimensions_per_place" label="Dimension Per Place" formik={formik} />

            <SharedInput name="cost_per_airplace" label="Cost Per Airplace" formik={formik} />

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

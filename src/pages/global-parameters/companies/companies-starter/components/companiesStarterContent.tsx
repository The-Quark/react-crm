import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { useLanguage } from '@/i18n';
import { timezoneMock } from '@/utils/enumsOptions/mocks.ts';
import {
  getCurrencies,
  getLanguages,
  postGlobalParameter,
  putGlobalParameter,
  getAirlines
} from '@/api';
import { useQuery } from '@tanstack/react-query';
import {
  SharedError,
  SharedInput,
  SharedLoading,
  SharedMultiSelect,
  SharedSelect
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router';
import { ParametersModel } from '@/api/get/getGlobalParams/getGlobalParameters/types.ts';
import { useIntl } from 'react-intl';

interface Props {
  isEditMode: boolean;
  parameterData?: ParametersModel;
  parameterId?: number;
}

const createParameterSchema = Yup.object().shape({
  company_name: Yup.string().required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
  timezone: Yup.string().required('VALIDATION.TIMEZONE_REQUIRED'),
  currency: Yup.string().required('VALIDATION.CURRENCY_REQUIRED'),
  language: Yup.string().required('VALIDATION.LANGUAGE_REQUIRED'),
  legal_address: Yup.string().required('VALIDATION.LEGAL_ADDRESS_REQUIRED'),
  warehouse_address: Yup.string().required('VALIDATION.WAREHOUSE_ADDRESS_REQUIRED'),
  airlines: Yup.array()
    .of(Yup.string().required())
    .min(1, 'VALIDATION.AIRLINES_MIN')
    .required('VALIDATION.AIRLINES_REQUIRED'),
  dimensions_per_place: Yup.string().required('VALIDATION.DIMENSIONS_PER_PLACE_REQUIRED'),
  cost_per_airplace: Yup.number().required('VALIDATION.COST_PER_AIRPLACE_REQUIRED')
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

const getInitialValues = (
  isEditMode: boolean,
  parameterData: ParametersModel,
  currentLanguage: string
): IParameterFormValues => {
  if (isEditMode && parameterData) {
    return {
      company_name: parameterData.company_name ?? '',
      timezone: parameterData.timezone ?? '',
      currency: parameterData.currency ?? '',
      language: parameterData.language.code ?? '',
      legal_address: parameterData.legal_address ?? '',
      warehouse_address: parameterData.warehouse_address ?? '',
      airlines: parameterData?.airlines.map((airline) => airline.id.toString()) || [],
      dimensions_per_place: parameterData.dimensions_per_place ?? '',
      cost_per_airplace: parseFloat(parameterData.cost_per_airplace) ?? 0
    };
  }
  return {
    company_name: '',
    timezone: '',
    currency: localStorage.getItem('app_currency') || 'USD',
    language: currentLanguage,
    legal_address: '',
    warehouse_address: '',
    airlines: [],
    dimensions_per_place: '',
    cost_per_airplace: 0
  };
};

export const CompaniesStarterContent = ({ isEditMode, parameterData, parameterId }: Props) => {
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const {
    data: currencyData,
    isLoading: loadingCurrencies,
    isError: isCurrenciesError,
    error: currenciesErrorMessage
  } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => getCurrencies({ is_active: true }),
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
    queryFn: () => getLanguages({ is_active: true }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['globalParameterAirlines'],
    queryFn: () => getAirlines({ is_active: true }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const formik = useFormik({
    initialValues: getInitialValues(
      isEditMode,
      parameterData as ParametersModel,
      currentLanguage.code
    ),
    validationSchema: createParameterSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && parameterId) {
          await putGlobalParameter(Number(parameterId), {
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
        company_name: parameterData.company_name ?? '',
        timezone: parameterData.timezone ?? '',
        currency: parameterData.currency ?? '',
        language: parameterData.language.code ?? '',
        legal_address: parameterData.legal_address ?? '',
        warehouse_address: parameterData.warehouse_address ?? '',
        airlines: parameterData?.airlines.map((airline) => airline.id.toString()) || [],
        dimensions_per_place: parameterData.dimensions_per_place ?? '',
        cost_per_airplace: parseFloat(parameterData.cost_per_airplace) ?? 0
      });
    }
  }, [parameterData, isEditMode, airlinesData]);

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
      {loadingCurrencies ||
      loadingLanguages ||
      airlinesLoading ||
      (isEditMode && !parameterData) ? (
        <SharedLoading />
      ) : (
        <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
          <div className="card-header" id="general_settings">
            <h3 className="card-title">{formatMessage({ id: 'SYSTEM.COMPANY' })}</h3>
          </div>
          <div className="card-body grid gap-5">
            <SharedInput
              name="company_name"
              label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
              formik={formik}
            />

            <SharedSelect
              name="currency"
              label={formatMessage({ id: 'SYSTEM.CURRENCY' })}
              formik={formik}
              options={
                currencyData?.result?.map((currency) => ({
                  label: currency.name,
                  value: currency.code
                })) || []
              }
            />
            <SharedSelect
              name="language"
              label={formatMessage({ id: 'SYSTEM.LANGUAGE' })}
              formik={formik}
              options={
                languagesData?.result?.map((lang) => ({ label: lang.name, value: lang.code })) || []
              }
            />

            <SharedSelect
              name="timezone"
              label={formatMessage({ id: 'SYSTEM.TIMEZONE' })}
              formik={formik}
              options={
                timezoneMock.map((time) => ({
                  label: time.timezone,
                  value: time.timezone
                })) || []
              }
            />

            <SharedInput
              name="legal_address"
              label={formatMessage({ id: 'SYSTEM.LEGAL_ADDRESS' })}
              formik={formik}
            />

            <SharedInput
              name="warehouse_address"
              label={formatMessage({ id: 'SYSTEM.WAREHOUSE_ADDRESS' })}
              formik={formik}
            />

            <SharedMultiSelect
              options={
                airlinesData?.result?.map((airline) => ({
                  value: airline.id.toString(),
                  label: airline.name
                })) || []
              }
              selectedValues={formik.values.airlines}
              onChange={(values) => formik.setFieldValue('airlines', values)}
              placeholder={formatMessage({ id: 'SYSTEM.SELECT_AIRLINES' })}
              searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_AIRLINES' })}
              label={formatMessage({ id: 'SYSTEM.AIRLINES' })}
              error={formik.errors.airlines as string}
              touched={formik.touched.airlines}
              key={parameterId}
            />

            <SharedInput
              name="dimensions_per_place"
              label={formatMessage({ id: 'SYSTEM.DIMENSIONS_PER_PLACE' })}
              formik={formik}
            />

            <SharedInput
              name="cost_per_airplace"
              label={formatMessage({ id: 'SYSTEM.COST_PER_PLACE' })}
              formik={formik}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || formik.isSubmitting}
              >
                {loading
                  ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                  : formatMessage({ id: 'SYSTEM.SAVE' })}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

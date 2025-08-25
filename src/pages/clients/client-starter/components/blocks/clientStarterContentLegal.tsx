import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { mockClientSystemStatus } from '@/utils';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { getCitiesByCountryCode, getCountries, postClient, putClient } from '@/api';
import { AxiosError } from 'axios';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedIntlPhoneInput,
  SharedLoading,
  SharedRating,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/api/get/getClients/types.ts';
import { Source } from '@/api/get/getGuides/getSources/types.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

interface Props {
  clientData?: Client;
  sourcesData?: Source[];
}

const ClientStarterContentLegal: FC<Props> = ({ clientData, sourcesData }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();

  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const validateSchema = Yup.object().shape({
    company_name: Yup.string().required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
    bin: Yup.string()
      .length(12, 'VALIDATION.FORM_VALIDATION_BIN_LENGTH')
      .matches(/^\d+$/, 'VALIDATION.FORM_VALIDATION_BIN_DIGITS')
      .required('VALIDATION.FORM_VALIDATION_BIN_REQUIRED'),
    representative_phone: Yup.string(),
    initials_code: clientData
      ? Yup.string()
          .min(3, 'VALIDATION.MIN_3_SYMBOLS')
          .required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED')
      : Yup.string().optional(),
    representative_email: Yup.string().email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID').optional(),
    notes: Yup.string().max(500, 'VALIDATION.MAXIMUM_500_SYMBOLS'),
    source_id: Yup.string().required('VALIDATION.FORM_VALIDATION_SOURCE_REQUIRED'),
    phone: Yup.string().required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
    email: Yup.string().email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID').optional(),
    password: clientData
      ? Yup.string()
          .min(10, 'VALIDATION.PASSWORD_MIN')
          .max(100, 'VALIDATION.PASSWORD_MAX')
          .matches(/[A-Z]/, 'VALIDATION.PASSWORD_UPPERCASE')
          .matches(/\d/, 'VALIDATION.PASSWORD_NUMBER')
          .matches(/[^a-zA-Z0-9]/, 'VALIDATION.PASSWORD_SPECIAL_CHAR')
          .optional()
      : Yup.mixed().notRequired()
  });

  const initialValues: IClientFormValues = {
    type: 'legal',
    company_name: clientData?.company_name || '',
    bin: clientData?.bin || '',
    business_type: clientData?.business_type || '',
    initials_code: clientData?.initials_code || '',
    legal_address: clientData?.legal_address || '',
    representative_first_name: clientData?.representative_first_name || '',
    representative_last_name: clientData?.representative_last_name || '',
    representative_patronymic: clientData?.representative_patronymic || '',
    representative_phone: clientData?.representative_phone || '',
    representative_email: clientData?.representative_email || '',
    notes: clientData?.notes || '',
    source_id: clientData ? clientData.source_id.toString() : '',
    phone: clientData?.phone || '',
    email: clientData?.email || '',
    country_id: clientData && clientData.country_id != null ? clientData.country_id.toString() : '',
    city_id: clientData && clientData.city_id != null ? clientData.city_id.toString() : '',
    client_status: clientData && clientData.client_status != null ? clientData.client_status : '',
    client_rating:
      clientData && clientData.client_rating != null ? Number(clientData.client_rating) : 1,
    password: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        if (clientData) {
          const { password, ...restValues } = values;
          await putClient(clientData.id, {
            ...restValues,
            ...(password ? { password } : {}),
            bin: String(values.bin)
          });
        } else {
          const { initials_code, ...postValues } = values;
          await postClient({
            ...postValues,
            bin: String(postValues.bin)
          });
        }
        resetForm();
        navigate('/clients');
        queryClient.invalidateQueries({ queryKey: ['clients'] });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus(error.response?.data?.message || 'Failed to create client');
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['legalCountries'],
    queryFn: () => getCountries('id,iso2,name')
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['legalCities', formik.values.country_id],
    queryFn: () => getCitiesByCountryCode(formik.values.country_id as string | number, 'id'),
    enabled: !!formik.values.country_id
  });

  const isFormLoading = countriesLoading || (clientData && citiesLoading);
  const isFormError = countriesIsError || (clientData && citiesIsError);
  const formErrors = [countriesError, citiesError].filter((error) => error !== null);

  if (isFormLoading) {
    return <SharedLoading simple />;
  }

  if (isFormError) {
    return (
      <div>
        {formErrors.map((error, index) => (
          <SharedError key={index} error={error} />
        ))}
      </div>
    );
  }

  return (
    <form className="card-body grid gap-5" onSubmit={formik.handleSubmit} noValidate>
      {clientData && (
        <SharedInput
          name="initials_code"
          label={formatMessage({ id: 'SYSTEM.CODE' })}
          formik={formik}
        />
      )}
      <SharedInput
        name="company_name"
        label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
        formik={formik}
      />
      <SharedInput
        name="bin"
        label={formatMessage({ id: 'SYSTEM.BIN' })}
        formik={formik}
        type="number"
        maxlength={12}
      />
      <SharedIntlPhoneInput
        name="phone"
        label={formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
        formik={formik}
      />
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 ">
        <label className="form-label max-w-56">
          {formatMessage({ id: 'SYSTEM.PHONE_NUMBER_HISTORY' })}
        </label>
        <div className="flex columns-1 w-full flex-wrap">
          {clientData?.phone_history?.length ? (
            clientData.phone_history.map((phone, index) => (
              <span key={index} className="badge badge-secondary mr-2 mb-2">
                {phone}
              </span>
            ))
          ) : (
            <div className="text-sm">{formatMessage({ id: 'SYSTEM.NO_VALUES' })}</div>
          )}
        </div>
      </div>
      <SharedSelect
        name="source_id"
        label={formatMessage({ id: 'SYSTEM.SOURCE' })}
        formik={formik}
        options={
          sourcesData?.map((source) => ({ label: source.name, value: source.id.toString() })) || []
        }
      />
      <SharedInput
        name="email"
        label={formatMessage({ id: 'SYSTEM.EMAIL' })}
        formik={formik}
        type="email"
      />
      <SharedInput
        name="business_type"
        label={formatMessage({ id: 'SYSTEM.BUSINESS_TYPE' })}
        formik={formik}
      />
      <SharedAutocomplete
        label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
        value={formik.values.country_id ?? clientData?.country_id ?? ''}
        options={countriesData?.data ?? []}
        placeholder={formatMessage({ id: 'SYSTEM.SELECT_COUNTRY' })}
        searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
        onChange={(val) => {
          formik.setFieldValue('country_id', val);
          formik.setFieldValue('city_id', '');
        }}
        error={formik.errors.country_id as string}
        touched={formik.touched.country_id}
        searchTerm={countrySearchTerm}
        onSearchTermChange={setCountrySearchTerm}
      />
      <SharedAutocomplete
        label={formatMessage({ id: 'SYSTEM.CITY' })}
        value={formik.values.city_id ?? clientData?.city_id ?? ''}
        options={citiesData?.data[0]?.cities ?? []}
        placeholder={
          formik.values.country_id
            ? formatMessage({ id: 'SYSTEM.SELECT_CITY' })
            : formatMessage({ id: 'SYSTEM.SELECT_COUNTRY_FIRST' })
        }
        onChange={(val) => formik.setFieldValue('city_id', val)}
        error={formik.errors.city_id as string}
        touched={formik.touched.city_id}
        searchTerm={citySearchTerm}
        onSearchTermChange={setCitySearchTerm}
        disabled={!formik.values.country_id}
        loading={citiesLoading}
        searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CITY' })}
        emptyText={formatMessage({ id: 'SYSTEM.NO_CITIES_AVAILABLE' })}
      />
      <SharedSelect
        name="client_status"
        label={formatMessage({ id: 'SYSTEM.CLIENT_STATUS' })}
        formik={formik}
        isClearable
        options={mockClientSystemStatus.map((opt) => ({
          label: opt.name,
          value: opt.value
        }))}
      />
      <SharedRating
        name="client_rating"
        label={formatMessage({ id: 'SYSTEM.RATING' })}
        formik={formik}
      />
      <SharedInput
        name="legal_address"
        label={formatMessage({ id: 'SYSTEM.LEGAL_ADDRESS' })}
        formik={formik}
      />
      <SharedInput
        name="representative_first_name"
        label={formatMessage({ id: 'SYSTEM.REPRESENTATIVE_FIRST_NAME' })}
        formik={formik}
      />
      <SharedInput
        name="representative_last_name"
        label={formatMessage({ id: 'SYSTEM.REPRESENTATIVE_LAST_NAME' })}
        formik={formik}
      />
      <SharedInput
        name="representative_patronymic"
        label={formatMessage({ id: 'SYSTEM.REPRESENTATIVE_PATRONYMIC' })}
        formik={formik}
      />
      <SharedIntlPhoneInput
        name="representative_phone"
        label={formatMessage({ id: 'SYSTEM.REPRESENTATIVE_PHONE' })}
        formik={formik}
      />
      <SharedInput
        name="representative_email"
        label={formatMessage({ id: 'SYSTEM.REPRESENTATIVE_EMAIL' })}
        formik={formik}
      />
      <SharedTextArea name="notes" label={formatMessage({ id: 'SYSTEM.NOTES' })} formik={formik} />
      {clientData && (
        <SharedInput
          name="password"
          label={formatMessage({ id: 'SYSTEM.PASSWORD' })}
          formik={formik}
          type="password"
        />
      )}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading
            ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
            : formatMessage({ id: 'SYSTEM.SAVE' })}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentLegal;

import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { getCitiesByCountryCode, getCountries, postClient, putClient } from '@/api';
import { AxiosError } from 'axios';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { Client } from '@/api/get/getClients/types.ts';
import { Source } from '@/api/get/getGuides/getSources/types.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Props {
  clientData?: Client;
  sourcesData?: Source[];
}

const validateSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  bin: Yup.string()
    .length(12, 'BIN must be exactly 12 digits')
    .matches(/^\d+$/, 'BIN must contain only digits')
    .required('Company bin is required'),
  representative_phone: Yup.string().matches(PHONE_REG_EXP, 'Phone number is not valid'),
  representative_email: Yup.string().email('Invalid email address').optional(),
  notes: Yup.string().max(500, 'Maximum 500 symbols'),
  source_id: Yup.string().required('Source is required'),
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Phone number is not valid')
    .required('Phone is required'),
  email: Yup.string().email('Invalid email address').optional()
});

const ClientStarterContentLegal: FC<Props> = ({ clientData, sourcesData }) => {
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialValues: IClientFormValues = {
    type: 'legal',
    company_name: clientData?.company_name || '',
    bin: clientData?.bin || '',
    business_type: clientData?.business_type || '',
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
    country_id:
      clientData && clientData.country_id !== undefined ? clientData.country_id.toString() : '',
    city_id: clientData && clientData.city_id !== undefined ? clientData.city_id.toString() : ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validateSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        if (clientData) {
          await putClient(clientData.id, {
            ...values,
            bin: String(values.bin)
          });
        } else {
          await postClient({
            ...values,
            bin: String(values.bin)
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
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['legalCities', formik.values.country_id],
    queryFn: () => getCitiesByCountryCode(formik.values.country_id as string | number, 'id'),
    enabled: !!formik.values.country_id,
    staleTime: 1000 * 60 * 5
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
      <SharedInput name="company_name" label="Company name" formik={formik} />
      <SharedInput name="bin" label="BIN" formik={formik} type="number" maxlength={12} />
      <SharedInput name="phone" label="Phone number" formik={formik} type="tel" />
      <SharedInput name="email" label="Email" formik={formik} type="email" />

      <SharedInput name="business_type" label="Business type" formik={formik} />
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Source</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
            value={formik.values.source_id}
            onValueChange={(value) => formik.setFieldValue('source_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              {sourcesData?.map((source) => (
                <SelectItem key={source.id} value={source.id.toString()}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.source_id && formik.errors.source_id && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.source_id}
            </span>
          )}
        </div>
      </div>

      <SharedAutocomplete
        label="Country"
        value={formik.values.country_id ?? clientData?.country_id ?? ''}
        options={countriesData?.data ?? []}
        placeholder="Select country"
        searchPlaceholder="Search country"
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
        label="City"
        value={formik.values.city_id ?? clientData?.city_id ?? ''}
        options={citiesData?.data[0]?.cities ?? []}
        placeholder={formik.values.country_id ? 'Select city' : 'Select country first'}
        searchPlaceholder="Search city"
        onChange={(val) => formik.setFieldValue('city_id', val)}
        error={formik.errors.city_id as string}
        touched={formik.touched.city_id}
        searchTerm={citySearchTerm}
        onSearchTermChange={setCitySearchTerm}
        disabled={!formik.values.country_id}
        loading={citiesLoading}
        errorText={citiesIsError ? 'Failed to load cities' : undefined}
        emptyText="No cities available"
      />
      <SharedInput name="legal_address" label="Legal address" formik={formik} />
      <SharedInput
        name="representative_first_name"
        label="Representative first name"
        formik={formik}
      />
      <SharedInput
        name="representative_last_name"
        label="Representative last name"
        formik={formik}
      />
      <SharedInput
        name="representative_patronymic"
        label="Representative patronymic"
        formik={formik}
      />
      <SharedInput
        name="representative_phone"
        label="Representative phone number"
        formik={formik}
        type="tel"
      />
      <SharedInput name="representative_email" label="Representative email" formik={formik} />
      <SharedTextArea name="notes" label="Notes" formik={formik} />

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading ? 'Please wait...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentLegal;

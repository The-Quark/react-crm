import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/utils/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { PHONE_REG_EXP } from '@/utils';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { getCitiesByCountryCode, getCountries, postClient, putClient } from '@/api';
import { AxiosError } from 'axios';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/api/get/getClients/types.ts';
import { Source } from '@/api/get/getGuides/getSources/types.ts';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockGenderUserOptions } from '@/utils/enumsOptions/mocks.ts';

interface Props {
  clientData?: Client;
  sourcesData?: Source[];
}

const validateSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').optional().nullable(),
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Phone number is not valid')
    .required('Phone is required'),
  notes: Yup.string().max(500, 'Maximum 500 symbols').nullable(),
  source_id: Yup.string().required('Source is required')
});

const ClientStarterContentIndividual: FC<Props> = ({ clientData, sourcesData }) => {
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialValues: IClientFormValues = {
    type: 'individual',
    first_name: clientData ? clientData.first_name : '',
    last_name: clientData ? clientData.last_name : '',
    patronymic: clientData && clientData.patronymic !== null ? clientData.patronymic : '',
    birth_date: clientData ? clientData.birth_date : '',
    gender: clientData ? clientData.gender : 'male',
    email: clientData && clientData.email !== null ? clientData.email : '',
    phone: clientData ? clientData.phone : '',
    notes: clientData && clientData.notes !== null ? clientData.notes : '',
    source_id: clientData ? clientData.source_id.toString() : '',
    country_id: clientData && clientData.country_id != null ? clientData.country_id.toString() : '',
    city_id: clientData && clientData.city_id != null ? clientData.city_id.toString() : ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        const payload = {
          ...values,
          birth_date: values.birth_date
            ? format(new Date(values.birth_date), 'dd.MM.yyyy HH:mm:ss')
            : ''
        };

        if (clientData) {
          await putClient(clientData.id, payload);
        } else {
          await postClient(payload);
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
    queryKey: ['clientCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['clientCities', formik.values.country_id],
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
      <SharedInput name="first_name" label="First name" formik={formik} />
      <SharedInput name="last_name" label="Last name" formik={formik} />
      <SharedInput name="patronymic" label="Patronymic" formik={formik} />

      <div className="w-full">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label flex- items-center gap-1 max-w-56">Birth Date</label>
          <div className="w-full flex columns-1 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <button id="date" className={cn('input data-[state=open]:border-primary')}>
                  <KeenIcon icon="calendar" className="-ms-0.5" />
                  <span>
                    {formik.values.birth_date
                      ? new Date(formik.values.birth_date).toLocaleDateString()
                      : 'Pick a date'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDate
                  initialFocus
                  mode="single"
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  defaultMonth={new Date(2000, 0)}
                  selected={formik.getFieldProps('birth_date').value}
                  onSelect={(value) => formik.setFieldValue('birth_date', value)}
                />
              </PopoverContent>
            </Popover>
            {formik.touched.birth_date && formik.errors.birth_date && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.birth_date}
              </span>
            )}
          </div>
        </div>
      </div>

      <SharedSelect
        name="gender"
        label="Gender"
        formik={formik}
        options={mockGenderUserOptions.map((option) => ({
          label: option.name,
          value: option.value
        }))}
      />

      <SharedSelect
        name="source_id"
        label="Source"
        formik={formik}
        options={
          sourcesData?.map((source) => ({ label: source.name, value: source.id.toString() })) || []
        }
      />

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

      <SharedInput name="email" label="Email" formik={formik} type="email" />
      <SharedInput name="phone" label="Phone number" formik={formik} type="tel" />
      <SharedTextArea name="notes" label="Notes" formik={formik} />

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading ? 'Please wait...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentIndividual;

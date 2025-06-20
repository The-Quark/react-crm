import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { BIN_LENGTH, CACHE_TIME, cleanValues, PHONE_REG_EXP, SEARCH_PER_PAGE } from '@/utils';
import { useFormik } from 'formik';
import { getCountries, getCitiesByCountryCode, getClients } from '@/api';
import { useQuery } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import { ISenderOrderFormValues } from '@/api/post/postWorkflow/postOrderSender/types.ts';
import { useFastFormContext } from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';
import { Client } from '@/api/get/getClients/types.ts';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const formSchema = Yup.object().shape({
  first_name: Yup.string().when('type', {
    is: 'individual',
    then: (schema) => schema.required('First name is required'),
    otherwise: (schema) => schema.optional()
  }),
  last_name: Yup.string().when('type', {
    is: 'individual',
    then: (schema) => schema.required('Last name is required'),
    otherwise: (schema) => schema.optional()
  }),
  patronymic: Yup.string().optional(),
  bin: Yup.string().when('type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'BIN must be exactly 12 digits')
        .matches(/^\d+$/, 'BIN must contain only digits')
        .required('Bin is required'),
    otherwise: (schema) => schema.optional()
  }),
  company_name: Yup.string().when('type', {
    is: 'legal',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.optional()
  }),
  city_id: Yup.number().required('City is required'),
  country_id: Yup.number().required('Country is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  street: Yup.string().required('Street is required'),
  house: Yup.string().required('House is required'),
  apartment: Yup.string().optional(),
  location_description: Yup.string().optional(),
  notes: Yup.string().optional()
});

const getInitialValues = (mainForm: ISenderOrderFormValues | null): ISenderOrderFormValues => {
  if (mainForm) {
    return {
      first_name: mainForm.first_name || '',
      last_name: mainForm.last_name || '',
      patronymic: mainForm.patronymic || '',
      bin: mainForm.bin || '',
      company_name: mainForm.company_name || '',
      type: mainForm.type || 'individual',
      country_id: mainForm.country_id || '',
      city_id: mainForm.city_id || '',
      phone: mainForm.phone || '',
      street: mainForm.street || '',
      house: mainForm.house || '',
      apartment: mainForm.apartment || '',
      location_description: mainForm.location_description || '',
      notes: mainForm.notes || '',
      contact_id: mainForm.contact_id || ''
    };
  }

  return {
    first_name: '',
    last_name: '',
    patronymic: '',
    bin: '',
    company_name: '',
    type: 'individual',
    country_id: '',
    city_id: '',
    phone: '',
    street: '',
    house: '',
    apartment: '',
    location_description: '',
    notes: '',
    contact_id: ''
  };
};

export const FastFormContentSenderForm: FC<Props> = ({ onNext, onBack }) => {
  const { mainForm, setMainForm, setModalInfoData, modalInfo } = useFastFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  console.log('Context sender: ', mainForm);

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['fastFormClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: SEARCH_PER_PAGE, search_application: clientSearchTerm }),
    staleTime: CACHE_TIME
  });

  const formik = useFormik({
    initialValues: getInitialValues(mainForm?.order?.sender as ISenderOrderFormValues),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const cleanData = cleanValues(values);
      setMainForm({
        ...mainForm,
        order: {
          ...mainForm?.order,
          sender: { ...(cleanData as ISenderOrderFormValues) }
        }
      });
      onNext();
    }
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['fastFormCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['fastFormSenderCities', formik.values.country_id],
    queryFn: () => getCitiesByCountryCode(formik.values.country_id as string | number, 'id'),
    enabled: !!formik.values.country_id
  });

  const handleClientChange = (clientId: string, clientData?: Client) => {
    const selectedClient =
      clientData || clientsData?.result?.find((client) => client.id === Number(clientId));

    if (selectedClient) {
      const isLegalClient = selectedClient.type === 'legal';

      formik.setValues({
        ...formik.values,
        first_name: isLegalClient ? '' : selectedClient.first_name || '',
        last_name: isLegalClient ? '' : selectedClient.last_name || '',
        patronymic: isLegalClient ? '' : selectedClient.patronymic || '',
        company_name: isLegalClient ? selectedClient.company_name || '' : '',
        bin: isLegalClient ? selectedClient.bin || '' : '',
        type: selectedClient.type || 'individual',
        phone: selectedClient.phone || '',
        country_id: selectedClient.country_id || '',
        city_id: selectedClient.city_id || '',
        street: formik.values.street || '',
        house: formik.values.house || '',
        apartment: formik.values.apartment || '',
        location_description: formik.values.location_description || '',
        notes: formik.values.notes || ''
      });

      setModalInfoData({
        ...modalInfo,
        sender_country_name: selectedClient?.country_name ?? '',
        sender_city_name: selectedClient?.city_name ?? ''
      });
    }
  };

  useEffect(() => {
    if (formik.values.contact_id) {
      const fetchClientData = async () => {
        try {
          const response = await getClients({ id: Number(formik.values.contact_id) });
          const client = response.result?.[0];
          if (client) {
            handleClientChange(String(client.id), client);
          }
        } catch (error) {
          console.error('Failed to fetch client data:', error);
        }
      };

      fetchClientData();
    }
  }, [formik.values.contact_id]);

  const isFormLoading = countriesLoading || clientsLoading;
  const isFormError = countriesIsError || clientsIsError;
  const formErrors = [countriesError, clientsError, citiesError].filter((error) => error !== null);

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
    <div className="grid gap-5 lg:gap-7.5">
      <form className="pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Contact"
            value={formik.values.contact_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder="Select contact"
            searchPlaceholder="Search contact"
            onChange={(val) => handleClientChange(String(val))}
            error={formik.errors.contact_id as string}
            touched={formik.touched.contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
          />

          {formik.values.type === 'legal' ? (
            <>
              <SharedInput name="company_name" label="Company name" formik={formik} />
              <SharedInput name="bin" label="BIN" formik={formik} />
            </>
          ) : (
            <>
              <SharedInput name="first_name" label="First name" formik={formik} />
              <SharedInput name="last_name" label="Last name" formik={formik} />
              <SharedInput name="patronymic" label="Patronymic" formik={formik} />
            </>
          )}

          <SharedInput name="phone" label="Phone" formik={formik} type="tel" />

          <SharedAutocomplete
            label="Country"
            value={formik.values.country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
            onChange={(val) => {
              const selectedCountry = countriesData?.data?.find((country) => country.id === val);
              formik.setFieldValue('country_id', val ? Number(val) : '');
              formik.setFieldValue('city_id', '');
              setModalInfoData({
                ...modalInfo,
                sender_country_name: selectedCountry?.name ?? '',
                sender_city_name: ''
              });
            }}
            error={formik.errors.country_id as string}
            touched={formik.touched.country_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          <SharedAutocomplete
            label="City"
            value={formik.values.city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={formik.values.city_id ? 'Select city' : 'Select country first'}
            searchPlaceholder="Search city"
            onChange={(val) => {
              formik.setFieldValue('city_id', val ? Number(val) : '');
              const selectedCity = citiesData?.data[0]?.cities?.find((city) => city.id === val);
              setModalInfoData({
                ...modalInfo,
                sender_city_name: selectedCity?.name ?? ''
              });
            }}
            error={formik.errors.city_id as string}
            touched={formik.touched.city_id}
            searchTerm={citySearchTerm}
            onSearchTermChange={setCitySearchTerm}
            disabled={!formik.values.country_id}
            loading={citiesLoading}
            errorText={citiesIsError ? 'Failed to load cities' : undefined}
            emptyText="No cities available"
          />

          <SharedInput name="street" label="Street" formik={formik} />
          <SharedInput name="house" label="House" formik={formik} />
          <SharedInput name="apartment" label="Apartment" formik={formik} />

          <SharedTextArea
            name="location_description"
            label="Location description"
            formik={formik}
          />
          <SharedTextArea name="notes" label="Notes" formik={formik} />

          <div className="flex justify-between">
            <button className="btn btn-light" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

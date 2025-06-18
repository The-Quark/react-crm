import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils';
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
import { useFastFormContext } from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';
import { IReceiverOrderFormValues } from '@/api/post/postWorkflow/postOrderReceiver/types.ts';

interface Props {
  onConfirmModal?: () => void;
  onBack: () => void;
}

const formSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  patronymic: Yup.string().optional(),
  city_id: Yup.number().required('City is required'),
  country_id: Yup.number().required('Country is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  street: Yup.string().required('Street is required'),
  house: Yup.string().required('House is required'),
  apartment: Yup.string().required('Apartment is required'),
  location_description: Yup.string().optional(),
  notes: Yup.string().optional()
});

const getInitialValues = (mainForm: IReceiverOrderFormValues | null): IReceiverOrderFormValues => {
  if (mainForm) {
    return {
      first_name: mainForm.first_name || '',
      last_name: mainForm.last_name || '',
      patronymic: mainForm.patronymic || '',
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

export const FastFormContentReceiverForm: FC<Props> = ({ onConfirmModal, onBack }) => {
  const { mainForm, setMainForm } = useFastFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['fastFormReceiverClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: 50 }),
    staleTime: 60 * 60 * 1000
  });

  const formik = useFormik({
    initialValues: getInitialValues(mainForm?.order?.receiver as IReceiverOrderFormValues),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setMainForm({
        ...mainForm,
        order: {
          ...mainForm?.order,
          receiver: values
        }
      });
      onConfirmModal?.();
    }
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['fastFormReceiverCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['fastFormReceiverCities', formik.values.country_id],
    queryFn: () => getCitiesByCountryCode(formik.values.country_id as string | number, 'id'),
    enabled: !!formik.values.country_id,
    staleTime: 1000 * 60 * 5
  });

  const handleClientChange = (clientId: string) => {
    formik.setFieldValue('contact_id', clientId);
    const selectedClient = clientsData?.result?.find((client) => client.id === Number(clientId));
    if (selectedClient) {
      formik.setValues({
        ...formik.values,
        first_name: selectedClient.first_name || '',
        last_name: selectedClient.last_name || '',
        patronymic: selectedClient.patronymic || '',
        phone: selectedClient.phone || ''
      });
    }
  };

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
                name:
                  [client.first_name, client.last_name, client.patronymic]
                    .filter(Boolean)
                    .join(' ') || client.company_name
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

          <SharedInput name="first_name" label="First name" formik={formik} />
          <SharedInput name="last_name" label="Last name" formik={formik} />
          <SharedInput name="patronymic" label="Patronymic" formik={formik} />
          <SharedInput name="phone" label="Phone" formik={formik} type="tel" />

          <SharedAutocomplete
            label="Country"
            value={formik.values.country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
            onChange={(val) => {
              formik.setFieldValue('country_id', val);
              formik.setFieldValue('city_id', '');
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
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

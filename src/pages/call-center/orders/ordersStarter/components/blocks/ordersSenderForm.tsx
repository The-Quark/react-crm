import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
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
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';

interface Props {
  onNext: () => void;
  onBack: () => void;
  orderData?: Order;
}

const formSchema = Yup.object().shape({
  sender_first_name: Yup.string().required('First name is required'),
  sender_last_name: Yup.string().required('Last name is required'),
  sender_patronymic: Yup.string().optional(),
  sender_city_id: Yup.number().typeError('City is required').required('City is required'),
  sender_country_id: Yup.number().typeError('Country is required').required('Country is required'),
  sender_phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Invalid phone number')
    .required('Phone is required'),
  sender_street: Yup.string().required('Street is required'),
  sender_house: Yup.string().required('House is required'),
  sender_apartment: Yup.string().required('Apartment is required'),
  sender_location_description: Yup.string().optional(),
  sender_notes: Yup.string().optional(),
  sender_contact_id: Yup.number().optional()
});

const getInitialValues = (isEditMode: boolean, orderData: Order): IOrderFormValues => {
  if (isEditMode && orderData) {
    return {
      sender_first_name: orderData.sender.first_name || '',
      sender_last_name: orderData.sender.last_name || '',
      sender_patronymic: orderData.sender.patronymic || '',
      sender_country_id: orderData.sender.city?.country_id || '',
      sender_city_id: orderData.sender.city_id || '',
      sender_phone: orderData.sender.phone || '',
      sender_street: orderData.sender.street || '',
      sender_house: orderData.sender.house || '',
      sender_apartment: orderData.sender.apartment || '',
      sender_location_description: orderData.sender.location_description || '',
      sender_notes: orderData.sender.notes || '',
      sender_contact_id: orderData.sender.contact_id || ''
    };
  }

  return {
    sender_first_name: '',
    sender_last_name: '',
    sender_patronymic: '',
    sender_country_id: '',
    sender_city_id: '',
    sender_phone: '',
    sender_street: '',
    sender_house: '',
    sender_apartment: '',
    sender_location_description: '',
    sender_notes: '',
    sender_contact_id: ''
  };
};

export const OrdersSenderForm: FC<Props> = ({ onNext, onBack, orderData }) => {
  const { setMainFormData, mainFormData } = useOrderCreation();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const { senderId } = useOrderCreation();
  const isEditMode = !!senderId;

  console.log('Form: ', mainFormData);

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderSenderClients'],
    queryFn: () => getClients(),
    staleTime: 60 * 60 * 1000
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, orderData as Order),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log('Sender: ', values);
      setMainFormData({ ...mainFormData, ...values });
      onNext();
    }
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['orderCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['orderCities', formik.values.sender_country_id],
    queryFn: () => getCitiesByCountryCode(formik.values.sender_country_id as string | number, 'id'),
    enabled: !!formik.values.sender_country_id,
    staleTime: 1000 * 60 * 5
  });

  const isFormLoading = countriesLoading || clientsLoading || (isEditMode && citiesLoading);
  const isFormError = countriesIsError || clientsIsError || (isEditMode && citiesIsError);
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
            value={formik.values.sender_contact_id ?? orderData?.sender.contact_id ?? ''}
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
            onChange={(val) => {
              formik.setFieldValue('sender_contact_id', val);
            }}
            error={formik.errors.sender_contact_id as string}
            touched={formik.touched.sender_contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
          />

          <SharedInput name="sender_first_name" label="First name" formik={formik} />
          <SharedInput name="sender_last_name" label="Last name" formik={formik} />
          <SharedInput name="sender_patronymic" label="Patronymic" formik={formik} />
          <SharedInput name="sender_phone" label="Phone" formik={formik} type="tel" />

          <SharedAutocomplete
            label="Country"
            value={formik.values.sender_country_id ?? orderData?.sender.city?.country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
            onChange={(val) => {
              formik.setFieldValue('sender_country_id', val);
              formik.setFieldValue('sender_city_id', '');
            }}
            error={formik.errors.sender_country_id as string}
            touched={formik.touched.sender_country_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          <SharedAutocomplete
            label="City"
            value={formik.values.sender_city_id ?? orderData?.sender.city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={formik.values.sender_city_id ? 'Select city' : 'Select country first'}
            searchPlaceholder="Search city"
            onChange={(val) => formik.setFieldValue('sender_city_id', val)}
            error={formik.errors.sender_city_id as string}
            touched={formik.touched.sender_city_id}
            searchTerm={citySearchTerm}
            onSearchTermChange={setCitySearchTerm}
            disabled={!formik.values.sender_country_id}
            loading={citiesLoading}
            errorText={citiesIsError ? 'Failed to load cities' : undefined}
            emptyText="No cities available"
          />

          <SharedInput name="sender_street" label="Street" formik={formik} />
          <SharedInput name="sender_house" label="House" formik={formik} />
          <SharedInput name="sender_apartment" label="Apartment" formik={formik} />

          <SharedTextArea
            name="sender_location_description"
            label="Location description"
            formik={formik}
          />
          <SharedTextArea name="sender_notes" label="Notes" formik={formik} />

          <div className="flex justify-between">
            <button className="btn btn-light" onClick={onBack}>
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

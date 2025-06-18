import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getCitiesByCountryCode, getClients, getCountries } from '@/api';
import { useFormik } from 'formik';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';

interface Props {
  onBack: () => void;
  onConfirmModal?: () => void;
  orderData?: Order;
}

const formSchema = Yup.object().shape({
  receiver_first_name: Yup.string().required('First name is required'),
  receiver_last_name: Yup.string().required('Last name is required'),
  receiver_patronymic: Yup.string().optional(),
  receiver_city_id: Yup.number().typeError('City is required').required('City is required'),
  receiver_country_id: Yup.number()
    .typeError('Country is required')
    .required('Country is required'),
  receiver_phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Invalid phone number')
    .required('Phone is required'),
  receiver_street: Yup.string().required('Street is required'),
  receiver_house: Yup.string().required('House is required'),
  receiver_apartment: Yup.string().optional(),
  receiver_location_description: Yup.string().optional(),
  receiver_notes: Yup.string().optional()
});

const getInitialValues = (
  isEditMode: boolean,
  orderData: Order,
  mainForm: IOrderFormValues | null
): IOrderFormValues => {
  if (isEditMode && orderData) {
    return {
      receiver_first_name: orderData.receiver.first_name || '',
      receiver_last_name: orderData.receiver.last_name || '',
      receiver_patronymic: orderData.receiver.patronymic || '',
      receiver_country_id: orderData.receiver.city?.country_id || '',
      receiver_city_id: orderData.receiver.city_id || '',
      receiver_phone: orderData.receiver.phone || '',
      receiver_street: orderData.receiver.street || '',
      receiver_house: orderData.receiver.house || '',
      receiver_apartment: orderData.receiver.apartment || '',
      receiver_location_description: orderData.receiver.location_description || '',
      receiver_notes: orderData.receiver.notes || '',
      receiver_contact_id: orderData.receiver.contact_id || ''
    };
  }

  return {
    receiver_first_name: mainForm?.receiver_first_name || '',
    receiver_last_name: mainForm?.receiver_last_name || '',
    receiver_patronymic: mainForm?.receiver_patronymic || '',
    receiver_country_id: mainForm?.receiver_country_id || '',
    receiver_city_id: mainForm?.receiver_city_id || '',
    receiver_phone: mainForm?.receiver_phone || '',
    receiver_street: mainForm?.receiver_street || '',
    receiver_house: mainForm?.receiver_house || '',
    receiver_apartment: mainForm?.receiver_apartment || '',
    receiver_location_description: mainForm?.receiver_location_description || '',
    receiver_notes: mainForm?.receiver_notes || '',
    receiver_contact_id: mainForm?.receiver_contact_id || ''
  };
};

export const OrdersReceiverForm: FC<Props> = ({ onBack, orderData, onConfirmModal }) => {
  const { setMainFormData, mainFormData } = useOrderCreation();
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const isEditMode = !!orderData;

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderReceiverClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: 50 }),
    staleTime: 60 * 60 * 1000
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, orderData as Order, mainFormData),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setMainFormData({ ...mainFormData, ...values });
      onConfirmModal?.();
    }
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['orderReceiverCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['orderReceiverCities', formik.values.receiver_country_id],
    queryFn: () =>
      getCitiesByCountryCode(formik.values.receiver_country_id as string | number, 'id'),
    enabled: !!formik.values.receiver_country_id,
    staleTime: 1000 * 60 * 5
  });

  const handleClientChange = (clientId: string) => {
    formik.setFieldValue('receiver_contact_id', clientId);
    const selectedClient = clientsData?.result?.find((client) => client.id === Number(clientId));
    if (selectedClient) {
      formik.setValues({
        ...formik.values,
        receiver_first_name: selectedClient.first_name || '',
        receiver_last_name: selectedClient.last_name || '',
        receiver_patronymic: selectedClient.patronymic || '',
        receiver_phone: selectedClient.phone || ''
      });
    }
  };

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
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Contact"
            value={formik.values.receiver_contact_id ?? orderData?.receiver.contact_id ?? ''}
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
            error={formik.errors.receiver_contact_id as string}
            touched={formik.touched.receiver_contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
          />

          <SharedInput name="receiver_first_name" label="First name" formik={formik} />
          <SharedInput name="receiver_last_name" label="Last name" formik={formik} />
          <SharedInput name="receiver_patronymic" label="Patronymic" formik={formik} />
          <SharedInput name="receiver_phone" label="Phone" formik={formik} type="tel" />

          <SharedAutocomplete
            label="Country"
            value={formik.values.receiver_country_id ?? orderData?.receiver.city?.country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
            onChange={(val) => {
              formik.setFieldValue('receiver_country_id', val);
              formik.setFieldValue('receiver_city_id', '');
            }}
            error={formik.errors.receiver_country_id as string}
            touched={formik.touched.receiver_country_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          <SharedAutocomplete
            label="City"
            value={formik.values.receiver_city_id ?? orderData?.receiver.city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={formik.values.receiver_city_id ? 'Select city' : 'Select country first'}
            searchPlaceholder="Search city"
            onChange={(val) => formik.setFieldValue('receiver_city_id', val)}
            error={formik.errors.receiver_city_id as string}
            touched={formik.touched.receiver_city_id}
            searchTerm={citySearchTerm}
            onSearchTermChange={setCitySearchTerm}
            disabled={!formik.values.receiver_country_id}
            loading={citiesLoading}
            errorText={citiesIsError ? 'Failed to load cities' : undefined}
            emptyText="No cities available"
          />

          <SharedInput name="receiver_street" label="Street" formik={formik} />
          <SharedInput name="receiver_house" label="House" formik={formik} />
          <SharedInput name="receiver_apartment" label="Apartment" formik={formik} />

          <SharedTextArea
            name="receiver_location_description"
            label="Location description"
            formik={formik}
          />
          <SharedTextArea name="receiver_notes" label="Notes" formik={formik} />

          <div className="flex justify-between">
            <button className="btn btn-primary" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Please wait...' : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

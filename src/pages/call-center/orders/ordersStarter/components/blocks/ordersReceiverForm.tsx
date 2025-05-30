import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCitiesByCountryCode,
  getClients,
  getCountries,
  getOrderReceivers,
  postOrderReceiver,
  putOrderReceiver
} from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import { IOrderReceiversResponse } from '@/api/get/getOrderReceivers/types.ts';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { IReceiverOrderFormValues } from '@/api/post/postOrderReceiver/types.ts';
import { Order } from '@/api/get/getOrder/types.ts';

interface Props {
  onBack: () => void;
  onSubmitSuccess?: () => void;
  orderData?: Order;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}
const formSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
  city_id: Yup.number().typeError('City is required').required('City is required'),
  country_id: Yup.number().typeError('Country is required').required('Country is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  street: Yup.string().required('Street is required'),
  house: Yup.string().required('House is required'),
  apartment: Yup.string().required('Apartment is required'),
  location_description: Yup.string().optional(),
  notes: Yup.string().optional(),
  contact_id: Yup.number().optional()
});

const getInitialValues = (
  isEditMode: boolean,
  receiverData: IOrderReceiversResponse
): IReceiverOrderFormValues => {
  if (isEditMode && receiverData?.result) {
    return {
      full_name: receiverData.result[0].full_name || '',
      country_id: receiverData.result[0].city.country_id || '',
      city_id: receiverData.result[0].city_id || '',
      phone: receiverData.result[0].phone || '',
      street: receiverData.result[0].street || '',
      house: receiverData.result[0].house || '',
      apartment: receiverData.result[0].apartment || '',
      location_description: receiverData.result[0].location_description || '',
      notes: receiverData.result[0].notes || '',
      contact_id: receiverData.result[0].contact_id || 0
    };
  }

  return {
    full_name: '',
    city_id: '',
    phone: '',
    street: '',
    house: '',
    apartment: '',
    location_description: '',
    notes: '',
    contact_id: '',
    country_id: ''
  };
};

export const OrdersReceiverForm: FC<Props> = ({ onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const { receiverId, setReceiverId } = useOrderCreation();
  const isEditMode = !!receiverId;
  const queryClient = useQueryClient();

  const {
    data: receiverData,
    isLoading: receiverIsLoading,
    isError: receiverIsError,
    error: receiverError
  } = useQuery({
    queryKey: ['orderReceiver', receiverId],
    queryFn: () => getOrderReceivers(Number(receiverId)),
    enabled: isEditMode
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderReceiverClients'],
    queryFn: () => getClients(),
    staleTime: 60 * 60 * 1000
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, receiverData as IOrderReceiversResponse),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && receiverId) {
          await putOrderReceiver(Number(receiverId), values);
        } else {
          const { result: newReceiverId } = await postOrderReceiver(values);
          setReceiverId(newReceiverId);
        }
        onNext();
        resetForm();
        setSearchTerm('');
        setCitySearchTerm('');
        setClientSearchTerm('');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
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
    queryKey: ['orderCities', formik.values.country_id || receiverData?.result[0]?.city.country_id],
    queryFn: () =>
      getCitiesByCountryCode(
        (formik.values.country_id || String(receiverData?.result[0]?.city.country_id)).toString(),
        'id'
      ),
    enabled: !!formik.values.country_id || !!receiverData?.result[0]?.city.country_id,
    staleTime: 1000 * 60 * 5
  });

  const isFormLoading =
    countriesLoading || clientsLoading || (isEditMode && (receiverIsLoading || citiesLoading));
  const isFormError =
    countriesIsError || clientsIsError || (isEditMode && (receiverIsError || citiesIsError));
  const formErrors = [countriesError, clientsError, receiverError, citiesError].filter(
    (error) => error !== null
  );
  if (isFormLoading) {
    return <SharedLoading />;
  }

  if (isFormError) {
    return (
      <div>
        {formErrors.map((error, index) => (
          <SharedError key={index} error={error} />
        ))}
        <button
          className="btn btn-primary"
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ['orderCountries', 'orderCities', 'orderReceiver']
            })
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode ? 'Edit Order Receiver' : 'New Order Receiver'}
          </h3>
        </div>
        <div className="card-body grid gap-5">
          <SharedInput name="full_name" label="Full name" formik={formik} />
          <SharedAutocomplete
            label="Country"
            value={formik.values.country_id}
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
            value={formik.values.city_id}
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
          <SharedInput name="phone" label="Phone" formik={formik} type="tel" />
          <SharedInput name="street" label="Street" formik={formik} />
          <SharedInput name="house" label="House" formik={formik} />
          <SharedInput name="apartment" label="Apartment" formik={formik} />
          <SharedTextArea
            name="location_description"
            label="Location description"
            formik={formik}
          />
          <SharedTextArea name="notes" label="Notes" formik={formik} />
          <SharedAutocomplete
            label="Contact"
            value={formik.values.contact_id ?? ''}
            options={
              clientsData?.result?.map((app) => ({
                id: app.id,
                name: app.first_name || app.company_name
              })) ?? []
            }
            placeholder="Select client"
            searchPlaceholder="Search application"
            onChange={(val) => {
              formik.setFieldValue('contact_id', val);
            }}
            error={formik.errors.contact_id as string}
            touched={formik.touched.contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
          />

          <div className="flex justify-between">
            <button className="btn btn-primary" onClick={onBack}>
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

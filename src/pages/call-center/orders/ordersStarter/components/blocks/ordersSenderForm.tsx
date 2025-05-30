import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { ISenderOrderFormValues } from '@/api/post/postOrderSender/types.ts';
import { useFormik } from 'formik';
import {
  postOrderSender,
  putOrderSender,
  getCountries,
  getCitiesByCountryCode,
  getOrderSenders,
  getClients
} from '@/api';
import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import { IOrderSendersResponse } from '@/api/get/getOrderSenders/types.ts';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';

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
  senderData: IOrderSendersResponse
): ISenderOrderFormValues => {
  if (isEditMode && senderData?.result) {
    return {
      full_name: senderData.result[0].full_name || '',
      country_id: senderData.result[0].city.country_id || '',
      city_id: senderData.result[0].city_id || '',
      phone: senderData.result[0].phone || '',
      street: senderData.result[0].street || '',
      house: senderData.result[0].house || '',
      apartment: senderData.result[0].apartment || '',
      location_description: senderData.result[0].location_description || '',
      notes: senderData.result[0].notes || '',
      contact_id: senderData.result[0].contact_id || 0
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

export const OrdersSenderForm: FC<Props> = ({ onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const { senderId, setSenderId } = useOrderCreation();
  const isEditMode = !!senderId;
  const queryClient = useQueryClient();

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

  const {
    data: senderData,
    isLoading: senderLoading,
    isError: senderIsError,
    error: senderError
  } = useQuery({
    queryKey: ['orderSender', senderId],
    queryFn: () => getOrderSenders(Number(senderId)),
    enabled: isEditMode
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, senderData as IOrderSendersResponse),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && senderId) {
          await putOrderSender(senderId, values);
        } else {
          const response = await postOrderSender(values);
          if (response?.result) {
            setSenderId(response.result);
          } else {
            throw new Error('Failed to get sender ID from response');
          }
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
    queryKey: ['orderCities', formik.values.country_id || senderData?.result[0]?.city.country_id],
    queryFn: () =>
      getCitiesByCountryCode(
        (formik.values.country_id || String(senderData?.result[0]?.city.country_id)).toString(),
        'id'
      ),
    enabled: !!formik.values.country_id || !!senderData?.result[0]?.city.country_id,
    staleTime: 1000 * 60 * 5
  });

  const isFormLoading =
    countriesLoading || clientsLoading || (isEditMode && (senderLoading || citiesLoading));
  const isFormError =
    countriesIsError || clientsIsError || (isEditMode && (senderIsError || citiesIsError));
  const formErrors = [countriesError, clientsError, senderError, citiesError].filter(
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
              queryKey: ['orderCountries', 'orderCities', 'orderSender']
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
      <form className="pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Contact"
            value={formik.values.contact_id ?? ''}
            options={
              clientsData?.result?.map((app) => ({
                id: app.id,
                name: app.first_name || app.company_name
              })) ?? []
            }
            placeholder="Select contact"
            searchPlaceholder="Search contact"
            onChange={(val) => {
              formik.setFieldValue('contact_id', val);
            }}
            error={formik.errors.contact_id as string}
            touched={formik.touched.contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
          />
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

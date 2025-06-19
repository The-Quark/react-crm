import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { BIN_LENGTH, CACHE_TIME, PHONE_REG_EXP, SEARCH_PER_PAGE } from '@/utils';
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
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { Client } from '@/api/get/getClients/types.ts';

interface Props {
  onBack: () => void;
  onConfirmModal?: () => void;
  isEditMode: boolean;
}

const formSchema = Yup.object().shape({
  receiver_first_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('First name is required'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_last_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('Last name is required'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_patronymic: Yup.string().optional(),
  receiver_bin: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'BIN must be exactly 12 digits')
        .matches(/^\d+$/, 'BIN must contain only digits')
        .required('Bin is required'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_name: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.optional()
  }),
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
  isLoading: boolean,
  isEditMode: boolean,
  mainForm: IOrderFormValues | null
): IOrderFormValues => {
  if (!isEditMode && mainForm) {
    return {
      receiver_first_name: mainForm?.receiver_first_name || '',
      receiver_last_name: mainForm?.receiver_last_name || '',
      receiver_patronymic: mainForm?.receiver_patronymic || '',
      receiver_company_name: mainForm?.receiver_company_name || '',
      receiver_bin: mainForm?.receiver_bin || '',
      receiver_type: mainForm?.receiver_type || (mainForm?.receiver_bin ? 'legal' : 'individual'),
      receiver_country_id: mainForm?.receiver_country_id
        ? Number(mainForm.receiver_country_id)
        : '',
      receiver_city_id: mainForm?.receiver_city_id ? Number(mainForm.receiver_city_id) : '',
      receiver_phone: mainForm?.receiver_phone || '',
      receiver_street: mainForm?.receiver_street || '',
      receiver_house: mainForm?.receiver_house || '',
      receiver_apartment: mainForm?.receiver_apartment || '',
      receiver_location_description: mainForm?.receiver_location_description || '',
      receiver_notes: mainForm?.receiver_notes || '',
      receiver_contact_id: mainForm?.receiver_contact_id || ''
    };
  }
  if (isEditMode && mainForm) {
    return {
      receiver_first_name: mainForm?.receiver_first_name || '',
      receiver_last_name: mainForm?.receiver_last_name || '',
      receiver_patronymic: mainForm?.receiver_patronymic || '',
      receiver_company_name: mainForm?.receiver_company_name || '',
      receiver_bin: mainForm?.receiver_bin || '',
      receiver_type: mainForm?.receiver_type || (mainForm?.receiver_bin ? 'legal' : 'individual'),
      receiver_country_id: mainForm?.receiver_country_id
        ? Number(mainForm.receiver_country_id)
        : '',
      receiver_city_id: mainForm?.receiver_city_id ? Number(mainForm.receiver_city_id) : '',
      receiver_phone: mainForm?.receiver_phone || '',
      receiver_street: mainForm?.receiver_street || '',
      receiver_house: mainForm?.receiver_house || '',
      receiver_apartment: mainForm?.receiver_apartment || '',
      receiver_location_description: mainForm?.receiver_location_description || '',
      receiver_notes: mainForm?.receiver_notes || '',
      receiver_contact_id: mainForm?.receiver_contact_id || ''
    };
  }
  return {
    receiver_first_name: '',
    receiver_last_name: '',
    receiver_patronymic: '',
    receiver_company_name: '',
    receiver_bin: '',
    receiver_type: 'individual',
    receiver_country_id: '',
    receiver_city_id: '',
    receiver_phone: '',
    receiver_street: '',
    receiver_house: '',
    receiver_apartment: '',
    receiver_location_description: '',
    receiver_notes: '',
    receiver_contact_id: ''
  };
};

export const OrdersReceiverForm: FC<Props> = ({ onBack, isEditMode, onConfirmModal }) => {
  const { setMainFormData, mainFormData, setModalInfoData, modalInfo, isLoading } =
    useOrderCreation();
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(
    mainFormData?.receiver_contact_id?.toString() || ''
  );

  console.log('Receiver mainFormData: ', mainFormData);
  console.log('Receiver loading: ', isLoading);

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderReceiverClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: SEARCH_PER_PAGE, search_application: clientSearchTerm }),
    staleTime: CACHE_TIME
  });

  const formik = useFormik({
    initialValues: getInitialValues(isLoading, isEditMode, mainFormData),
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
    enabled: !!formik.values.receiver_country_id
  });

  const handleClientChange = (clientId: string, clientData?: Client) => {
    setSelectedClientId(clientId);
    const selectedClient =
      clientData || clientsData?.result?.find((client) => client.id === Number(clientId));

    if (selectedClient) {
      const isLegalClient = selectedClient.type === 'legal';

      formik.setValues({
        ...formik.values,
        receiver_contact_id: clientId,
        receiver_first_name: isLegalClient ? '' : selectedClient.first_name || '',
        receiver_last_name: isLegalClient ? '' : selectedClient.last_name || '',
        receiver_patronymic: isLegalClient ? '' : selectedClient.patronymic || '',
        receiver_company_name: isLegalClient ? selectedClient.company_name || '' : '',
        receiver_bin: isLegalClient ? selectedClient.bin || '' : '',
        receiver_type: selectedClient.type || 'individual',
        receiver_phone: selectedClient.phone || '',
        receiver_country_id: selectedClient.country_id || '',
        receiver_city_id: selectedClient.city_id || '',
        receiver_street: formik.values.receiver_street || '',
        receiver_house: formik.values.receiver_house || '',
        receiver_apartment: formik.values.receiver_apartment || '',
        receiver_location_description: formik.values.receiver_location_description || '',
        receiver_notes: formik.values.receiver_notes || ''
      });
      setModalInfoData({
        ...modalInfo,
        receiver_country_name: selectedClient?.country_name ?? '',
        receiver_city_name: selectedClient?.city_name ?? ''
      });
    }
  };

  useEffect(() => {
    if (formik.values.receiver_contact_id && !isEditMode) {
      const fetchClientData = async () => {
        try {
          const response = await getClients({ id: Number(formik.values.receiver_contact_id) });
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
  }, [formik.values.receiver_contact_id]);

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
            value={formik.values.receiver_contact_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
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

          {formik.values.receiver_type === 'legal' ? (
            <>
              <SharedInput name="receiver_company_name" label="Company name" formik={formik} />
              <SharedInput name="receiver_bin" label="BIN" formik={formik} />
            </>
          ) : (
            <>
              <SharedInput name="receiver_first_name" label="First name" formik={formik} />
              <SharedInput name="receiver_last_name" label="Last name" formik={formik} />
              <SharedInput name="receiver_patronymic" label="Patronymic" formik={formik} />
            </>
          )}

          <SharedInput name="receiver_phone" label="Phone" formik={formik} type="tel" />

          <SharedAutocomplete
            label="Country"
            value={formik.values.receiver_country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
            onChange={(val) => {
              const selectedCountry = countriesData?.data?.find((country) => country.id === val);
              formik.setFieldValue('receiver_country_id', val ? Number(val) : '');
              formik.setFieldValue('receiver_city_id', '');
              setModalInfoData({
                ...modalInfo,
                receiver_country_name: selectedCountry?.name ?? '',
                receiver_city_name: ''
              });
            }}
            error={formik.errors.receiver_country_id as string}
            touched={formik.touched.receiver_country_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          <SharedAutocomplete
            label="City"
            value={formik.values.receiver_city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={formik.values.receiver_city_id ? 'Select city' : 'Select country first'}
            searchPlaceholder="Search city"
            onChange={(val) => {
              formik.setFieldValue('receiver_city_id', val ? Number(val) : '');
              const selectedCity = citiesData?.data[0]?.cities?.find((city) => city.id === val);
              setModalInfoData({
                ...modalInfo,
                receiver_city_name: selectedCity?.name ?? ''
              });
            }}
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
            <button className="btn btn-light" onClick={onBack}>
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

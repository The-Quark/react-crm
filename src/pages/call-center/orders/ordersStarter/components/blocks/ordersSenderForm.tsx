import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { BIN_LENGTH, CACHE_TIME, PHONE_REG_EXP, SEARCH_PER_PAGE } from '@/utils';
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
import { Client } from '@/api/get/getClients/types.ts';

interface Props {
  onNext: () => void;
  onBack: () => void;
  isEditMode: boolean;
}

const formSchema = Yup.object().shape({
  sender_first_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('First name is required'),
    otherwise: (schema) => schema.optional()
  }),
  sender_last_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('Last name is required'),
    otherwise: (schema) => schema.optional()
  }),
  sender_patronymic: Yup.string().optional(),
  sender_bin: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'BIN must be exactly 12 digits')
        .matches(/^\d+$/, 'BIN must contain only digits')
        .required('Bin is required'),
    otherwise: (schema) => schema.optional()
  }),
  sender_company_name: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.optional()
  }),
  sender_city_id: Yup.number().required('City is required'),
  sender_country_id: Yup.number().required('Country is required'),
  sender_phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Invalid phone number')
    .required('Phone is required'),
  sender_street: Yup.string().required('Street is required'),
  sender_house: Yup.string().required('House is required'),
  sender_apartment: Yup.string().optional(),
  sender_location_description: Yup.string().optional(),
  sender_notes: Yup.string().optional()
});

const getInitialValues = (
  isLoading: boolean,
  isEditMode: boolean,
  mainForm: IOrderFormValues | null
): IOrderFormValues => {
  if (!isEditMode && mainForm) {
    return {
      sender_first_name: mainForm?.sender_first_name || '',
      sender_last_name: mainForm?.sender_last_name || '',
      sender_patronymic: mainForm?.sender_patronymic || '',
      sender_company_name: mainForm?.sender_company_name || '',
      sender_bin: mainForm?.sender_bin || '',
      sender_type: mainForm?.sender_type || (mainForm?.sender_bin ? 'legal' : 'individual'),
      sender_country_id: mainForm?.sender_country_id ? Number(mainForm.sender_country_id) : '',
      sender_city_id: mainForm?.sender_city_id ? Number(mainForm.sender_city_id) : '',
      sender_phone: mainForm?.sender_phone || '',
      sender_street: mainForm?.sender_street || '',
      sender_house: mainForm?.sender_house || '',
      sender_apartment: mainForm?.sender_apartment || '',
      sender_location_description: mainForm?.sender_location_description || '',
      sender_notes: mainForm?.sender_notes || '',
      sender_contact_id: mainForm?.sender_contact_id || ''
    };
  }

  if (isEditMode && mainForm) {
    return {
      sender_first_name: mainForm?.sender_first_name || '',
      sender_last_name: mainForm?.sender_last_name || '',
      sender_patronymic: mainForm?.sender_patronymic || '',
      sender_company_name: mainForm?.sender_company_name || '',
      sender_bin: mainForm?.sender_bin || '',
      sender_type: mainForm?.sender_type || (mainForm?.sender_bin ? 'legal' : 'individual'),
      sender_country_id: mainForm?.sender_country_id ? Number(mainForm.sender_country_id) : '',
      sender_city_id: mainForm?.sender_city_id ? Number(mainForm.sender_city_id) : '',
      sender_phone: mainForm?.sender_phone || '',
      sender_street: mainForm?.sender_street || '',
      sender_house: mainForm?.sender_house || '',
      sender_apartment: mainForm?.sender_apartment || '',
      sender_location_description: mainForm?.sender_location_description || '',
      sender_notes: mainForm?.sender_notes || '',
      sender_contact_id: mainForm?.sender_contact_id || ''
    };
  }

  return {
    sender_first_name: '',
    sender_last_name: '',
    sender_patronymic: '',
    sender_company_name: '',
    sender_bin: '',
    sender_type: 'individual',
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

export const OrdersSenderForm: FC<Props> = ({ onNext, onBack, isEditMode }) => {
  const { setMainFormData, mainFormData, setModalInfoData, modalInfo, isLoading } =
    useOrderCreation();
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(
    mainFormData?.sender_contact_id?.toString() || ''
  );

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderSenderClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: SEARCH_PER_PAGE, search_application: clientSearchTerm }),
    staleTime: CACHE_TIME
  });

  const formik = useFormik({
    initialValues: getInitialValues(isLoading, isEditMode, mainFormData),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
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
    queryKey: ['orderSenderCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['orderSenderCities', formik.values.sender_country_id],
    queryFn: () => getCitiesByCountryCode(formik.values.sender_country_id as string | number, 'id'),
    enabled: !!formik.values.sender_country_id
  });

  const handleClientChange = (clientId: string, clientData?: Client) => {
    setSelectedClientId(clientId);
    const selectedClient =
      clientData || clientsData?.result?.find((client) => client.id === Number(clientId));

    if (selectedClient) {
      const isLegalClient = selectedClient.type === 'legal';

      formik.setValues({
        ...formik.values,
        sender_contact_id: clientId,
        sender_first_name: isLegalClient ? '' : selectedClient.first_name || '',
        sender_last_name: isLegalClient ? '' : selectedClient.last_name || '',
        sender_patronymic: isLegalClient ? '' : selectedClient.patronymic || '',
        sender_company_name: isLegalClient ? selectedClient.company_name || '' : '',
        sender_bin: isLegalClient ? selectedClient.bin || '' : '',
        sender_type: selectedClient.type || 'individual',
        sender_phone: selectedClient.phone || '',
        sender_country_id: selectedClient.country_id || '',
        sender_city_id: selectedClient.city_id || '',
        sender_street: formik.values.sender_street || '',
        sender_house: formik.values.sender_house || '',
        sender_apartment: formik.values.sender_apartment || '',
        sender_location_description: formik.values.sender_location_description || '',
        sender_notes: formik.values.sender_notes || ''
      });

      setModalInfoData({
        ...modalInfo,
        sender_country_name: selectedClient?.country_name ?? '',
        sender_city_name: selectedClient?.city_name ?? ''
      });
    }
  };

  useEffect(() => {
    if (formik.values.sender_contact_id && !isEditMode) {
      const fetchClientData = async () => {
        try {
          const response = await getClients({ id: Number(formik.values.sender_contact_id) });
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
  }, [formik.values.sender_contact_id]);

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
            value={formik.values.sender_contact_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder="Select contact"
            searchPlaceholder="Search contact"
            onChange={(val) => handleClientChange(String(val))}
            error={formik.errors.sender_contact_id as string}
            touched={formik.touched.sender_contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
          />

          {formik.values.sender_type === 'legal' ? (
            <>
              <SharedInput name="sender_company_name" label="Company name" formik={formik} />
              <SharedInput
                name="sender_bin"
                label="BIN"
                formik={formik}
                type="number"
                maxlength={12}
              />
            </>
          ) : (
            <>
              <SharedInput name="sender_first_name" label="First name" formik={formik} />
              <SharedInput name="sender_last_name" label="Last name" formik={formik} />
              <SharedInput name="sender_patronymic" label="Patronymic" formik={formik} />
            </>
          )}

          <SharedInput name="sender_phone" label="Phone" formik={formik} type="tel" />

          <SharedAutocomplete
            label="Country"
            value={formik.values.sender_country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
            onChange={(val) => {
              const selectedCountry = countriesData?.data?.find((country) => country.id === val);
              formik.setFieldValue('sender_country_id', val ? Number(val) : '');
              formik.setFieldValue('sender_city_id', '');
              setModalInfoData({
                ...modalInfo,
                sender_country_name: selectedCountry?.name ?? '',
                sender_city_name: ''
              });
            }}
            error={formik.errors.sender_country_id as string}
            touched={formik.touched.sender_country_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          <SharedAutocomplete
            label="City"
            value={formik.values.sender_city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={formik.values.sender_city_id ? 'Select city' : 'Select country first'}
            searchPlaceholder="Search city"
            onChange={(val) => {
              formik.setFieldValue('sender_city_id', val ? Number(val) : '');
              const selectedCity = citiesData?.data[0]?.cities?.find((city) => city.id === val);
              setModalInfoData({
                ...modalInfo,
                sender_city_name: selectedCity?.name ?? ''
              });
            }}
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
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Please wait...' : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

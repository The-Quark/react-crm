import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { BIN_LENGTH, PHONE_REG_EXP, SEARCH_PER_PAGE } from '@/utils';
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
  sender_first_name: Yup.string().when('sender_type', {
    is: 'individual',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  sender_last_name: Yup.string().when('sender_type', {
    is: 'individual',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  sender_patronymic: Yup.string().optional(),
  sender_bin: Yup.string().when('sender_type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'VALIDATION.FORM_VALIDATION_BIN_LENGTH')
        .matches(/^\d+$/, 'VALIDATION.FORM_VALIDATION_BIN_DIGITS')
        .required('VALIDATION.FORM_VALIDATION_BIN_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  sender_company_name: Yup.string().when('sender_type', {
    is: 'legal',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  sender_city_id: Yup.number().required('VALIDATION.CITY_REQUIRED'),
  sender_country_id: Yup.number().required('VALIDATION.COUNTRY_REQUIRED'),
  sender_phone: Yup.string()
    .matches(PHONE_REG_EXP, 'VALIDATION.FORM_VALIDATION_PHONE_INVALID')
    .required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
  sender_street: Yup.string().required('VALIDATION.STREET_REQUIRED'),
  sender_house: Yup.string().required('VALIDATION.HOUSE_REQUIRED'),
  sender_apartment: Yup.string().optional(),
  sender_location_description: Yup.string().optional(),
  sender_notes: Yup.string().optional()
});

const getInitialValues = (mainForm: IOrderFormValues | null): IOrderFormValues => {
  if (mainForm) {
    return {
      ...mainForm,
      sender_first_name: mainForm.sender_first_name || '',
      sender_last_name: mainForm.sender_last_name || '',
      sender_patronymic: mainForm.sender_patronymic || '',
      sender_company_name: mainForm.sender_company_name || '',
      sender_bin: mainForm.sender_bin || '',
      sender_type: mainForm.sender_type || (mainForm.sender_bin ? 'legal' : 'individual'),
      sender_country_id: mainForm.sender_country_id || '',
      sender_city_id: mainForm.sender_city_id || '',
      sender_phone: mainForm.sender_phone || '',
      sender_street: mainForm.sender_street || '',
      sender_house: mainForm.sender_house || '',
      sender_apartment: mainForm.sender_apartment || '',
      sender_location_description: mainForm.sender_location_description || '',
      sender_notes: mainForm.sender_notes || '',
      sender_contact_id: mainForm.sender_contact_id || ''
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
  const { formatMessage } = useIntl();
  const { setMainFormData, mainFormData, setModalInfoData, modalInfo } = useOrderCreation();

  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const formik = useFormik({
    initialValues: getInitialValues(mainFormData),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setMainFormData({ ...mainFormData, ...values });
      onNext();
    }
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderSenderClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: SEARCH_PER_PAGE, search_application: clientSearchTerm })
  });

  const {
    data: specificClientData,
    isLoading: specificClientLoading,
    isError: specificClientIsError,
    error: specificClientError
  } = useQuery({
    queryKey: ['orderSenderSpecificClient', formik.values.sender_contact_id],
    queryFn: () => getClients({ id: Number(formik.values.sender_contact_id) }),
    enabled: !!formik.values.sender_contact_id && !isEditMode && isInitialLoad
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['orderSenderCountries'],
    queryFn: () => getCountries('id,iso2,name')
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
    const selectedClient =
      clientData ||
      clientsData?.result?.find((client) => client.id === Number(clientId)) ||
      specificClientData?.result?.find((client) => client.id === Number(clientId));

    if (selectedClient) {
      const isLegalClient = selectedClient.type === 'legal';
      const currentValues = formik.values;

      const baseValues = {
        ...currentValues,
        sender_contact_id: clientId,
        sender_type: selectedClient.type || 'individual',
        sender_phone: selectedClient.phone || currentValues.sender_phone,
        sender_country_id: selectedClient.country_id || currentValues.sender_country_id,
        sender_city_id: selectedClient.city_id || currentValues.sender_city_id,
        sender_street: currentValues.sender_street || '',
        sender_house: currentValues.sender_house || '',
        sender_apartment: currentValues.sender_apartment || '',
        sender_location_description: currentValues.sender_location_description || '',
        sender_notes: currentValues.sender_notes || ''
      };

      if (isLegalClient) {
        formik.setValues({
          ...baseValues,
          sender_company_name: selectedClient.company_name || '',
          sender_bin: selectedClient.bin || '',
          sender_first_name: '',
          sender_last_name: '',
          sender_patronymic: ''
        });
      } else {
        formik.setValues({
          ...baseValues,
          sender_first_name: selectedClient.first_name || '',
          sender_last_name: selectedClient.last_name || '',
          sender_patronymic: selectedClient.patronymic || '',
          sender_company_name: '',
          sender_bin: ''
        });
      }

      setModalInfoData({
        ...modalInfo,
        sender_country_name: selectedClient?.country_name ?? modalInfo?.sender_country_name,
        sender_city_name: selectedClient?.city_name ?? modalInfo?.sender_city_name
      });
    }
  };

  useEffect(() => {
    if (specificClientData?.result?.[0] && isInitialLoad && !isEditMode) {
      const client = specificClientData.result[0];
      handleClientChange(String(client.id), client);
      setIsInitialLoad(false);
    }
  }, [specificClientData, isInitialLoad, isEditMode]);

  const isFormLoading = countriesLoading || specificClientLoading || (isEditMode && citiesLoading);
  const isFormError =
    countriesIsError || clientsIsError || specificClientIsError || (isEditMode && citiesIsError);
  const formErrors = [countriesError, clientsError, specificClientError, citiesError].filter(
    (error) => error !== null
  );

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
            label={formatMessage({ id: 'SYSTEM.CONTACT' })}
            value={formik.values.sender_contact_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_CONTACT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CONTACT' })}
            onChange={(val) => handleClientChange(String(val))}
            error={formik.errors.sender_contact_id as string}
            touched={formik.touched.sender_contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
            loading={clientsLoading}
          />

          <input type="hidden" name="sender_type" value={formik.values.sender_type} />

          {formik.values.sender_type === 'legal' ? (
            <>
              <SharedInput
                name="sender_company_name"
                label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="sender_bin"
                label={formatMessage({ id: 'SYSTEM.BIN' })}
                formik={formik}
                type="number"
                maxlength={12}
              />
            </>
          ) : (
            <>
              <SharedInput
                name="sender_first_name"
                label={formatMessage({ id: 'SYSTEM.FIRST_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="sender_last_name"
                label={formatMessage({ id: 'SYSTEM.LAST_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="sender_patronymic"
                label={formatMessage({ id: 'SYSTEM.PATRONYMIC' })}
                formik={formik}
              />
            </>
          )}

          <SharedInput
            name="sender_phone"
            label={formatMessage({ id: 'SYSTEM.PHONE' })}
            formik={formik}
            type="tel"
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
            value={formik.values.sender_country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
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
            label={formatMessage({ id: 'SYSTEM.CITY' })}
            value={formik.values.sender_city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={
              formik.values.sender_city_id
                ? formatMessage({ id: 'SYSTEM.SELECT' })
                : formatMessage({ id: 'SYSTEM.SELECT_COUNTRY_FIRST' })
            }
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CITY' })}
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
            errorText={
              citiesIsError ? formatMessage({ id: 'SYSTEM.FAILED_LOAD_CITIES' }) : undefined
            }
            emptyText={formatMessage({ id: 'SYSTEM.NO_CITIES_AVAILABLE' })}
          />
          <SharedInput
            name="sender_street"
            label={formatMessage({ id: 'SYSTEM.STREET' })}
            formik={formik}
          />
          <SharedInput
            name="sender_house"
            label={formatMessage({ id: 'SYSTEM.HOUSE' })}
            formik={formik}
          />
          <SharedInput
            name="sender_apartment"
            label={formatMessage({ id: 'SYSTEM.APARTMENT' })}
            formik={formik}
          />
          <SharedTextArea
            name="sender_location_description"
            label={formatMessage({ id: 'SYSTEM.LOCATION_DESCRIPTION' })}
            formik={formik}
          />
          <SharedTextArea
            name="sender_notes"
            label={formatMessage({ id: 'SYSTEM.NOTES' })}
            formik={formik}
          />

          <div className="flex justify-between">
            <button className="btn btn-light" onClick={onBack}>
              {formatMessage({ id: 'SYSTEM.BACK' })}
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                : formatMessage({ id: 'SYSTEM.NEXT' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

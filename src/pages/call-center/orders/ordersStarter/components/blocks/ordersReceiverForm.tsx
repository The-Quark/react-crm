import React, { FC, useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { BIN_LENGTH, SEARCH_PER_PAGE } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getCitiesByCountryCode, getClients, getCountries } from '@/api';
import { useFormik } from 'formik';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedIntlPhoneInput,
  SharedLoading,
  SharedRadio,
  SharedTextArea
} from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { Client } from '@/api/get/getClients/types.ts';
import { ClientType } from '@/api/enums';

interface Props {
  onBack: () => void;
  onConfirmModal?: () => void;
  isEditMode: boolean;
}

const formSchema = Yup.object().shape({
  receiver_first_name: Yup.string().when('receiver_type', {
    is: ClientType.INDIVIDUAL,
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_last_name: Yup.string().when('receiver_type', {
    is: ClientType.INDIVIDUAL,
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_patronymic: Yup.string().optional(),
  receiver_bin: Yup.string().when('receiver_type', {
    is: ClientType.LEGAL,
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'VALIDATION.FORM_VALIDATION_BIN_LENGTH')
        .matches(/^\d+$/, 'VALIDATION.FORM_VALIDATION_BIN_DIGITS')
        .required('VALIDATION.FORM_VALIDATION_BIN_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_company_name: Yup.string().when('receiver_type', {
    is: ClientType.LEGAL,
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  receiver_city_id: Yup.number().required('VALIDATION.CITY_REQUIRED'),
  receiver_country_id: Yup.number().required('VALIDATION.COUNTRY_REQUIRED'),
  receiver_phone: Yup.string().required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
  receiver_street: Yup.string().required('VALIDATION.STREET_REQUIRED'),
  receiver_house: Yup.string().required('VALIDATION.HOUSE_REQUIRED'),
  receiver_apartment: Yup.string().optional(),
  receiver_location_description: Yup.string().optional(),
  receiver_notes: Yup.string().optional()
});

const getInitialValues = (mainForm: IOrderFormValues | null): IOrderFormValues => {
  if (mainForm) {
    return {
      ...mainForm,
      receiver_first_name: mainForm?.receiver_first_name || '',
      receiver_last_name: mainForm?.receiver_last_name || '',
      receiver_patronymic: mainForm?.receiver_patronymic || '',
      receiver_company_name: mainForm?.receiver_company_name || '',
      receiver_bin: mainForm?.receiver_bin || '',
      receiver_type:
        mainForm?.receiver_type ||
        (mainForm?.receiver_bin ? ClientType.LEGAL : ClientType.INDIVIDUAL),
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
  }
  return {
    receiver_first_name: '',
    receiver_last_name: '',
    receiver_patronymic: '',
    receiver_company_name: '',
    receiver_bin: '',
    receiver_type: ClientType.INDIVIDUAL,
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
  const { formatMessage } = useIntl();
  const { setMainFormData, mainFormData } = useOrderCreation();

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
      onConfirmModal?.();
    }
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['orderReceiverClients', clientSearchTerm],
    queryFn: () => getClients({ per_page: SEARCH_PER_PAGE, search_application: clientSearchTerm })
  });

  const {
    data: specificClientData,
    isLoading: specificClientLoading,
    isError: specificClientIsError,
    error: specificClientError
  } = useQuery({
    queryKey: ['orderReceiverSpecificClient', formik.values.receiver_contact_id],
    queryFn: () => getClients({ id: Number(formik.values.receiver_contact_id) }),
    enabled: !!formik.values.receiver_contact_id && !isEditMode && isInitialLoad
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['orderReceiverCountries'],
    queryFn: () => getCountries('id,iso2,name')
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: [
      'orderReceiverCities',
      formik.values.receiver_country_id,
      formik.values.receiver_city_id
    ],
    queryFn: () =>
      getCitiesByCountryCode(formik.values.receiver_country_id as string | number, 'id'),
    enabled: !!formik.values.receiver_country_id
  });

  const handleClientChange = useCallback(
    (clientId: string, clientData?: Client) => {
      if (clientId === '') {
        formik.setValues({
          ...formik.values,
          receiver_contact_id: '',
          receiver_first_name: '',
          receiver_last_name: '',
          receiver_patronymic: '',
          receiver_company_name: '',
          receiver_bin: '',
          receiver_type: ClientType.INDIVIDUAL,
          receiver_phone: '',
          receiver_country_id: '',
          receiver_city_id: '',
          receiver_street: '',
          receiver_house: '',
          receiver_apartment: ''
        });
        return;
      }
      const selectedClient =
        clientData ||
        clientsData?.result?.find((client) => client.id === Number(clientId)) ||
        specificClientData?.result?.find((client) => client.id === Number(clientId));

      if (selectedClient) {
        const isLegalClient = selectedClient.type === ClientType.LEGAL;
        const currentValues = formik.values;

        const baseValues = {
          ...currentValues,
          receiver_contact_id: clientId,
          receiver_type: selectedClient.type || ClientType.INDIVIDUAL,
          receiver_phone: selectedClient.phone || currentValues.receiver_phone,
          receiver_country_id: selectedClient.country_id || currentValues.receiver_country_id,
          receiver_city_id: selectedClient.city_id || currentValues.receiver_city_id,
          receiver_street: currentValues.receiver_street || '',
          receiver_house: currentValues.receiver_house || '',
          receiver_apartment: currentValues.receiver_apartment || '',
          receiver_location_description: currentValues.receiver_location_description || '',
          receiver_notes: currentValues.receiver_notes || '',
          receiver_country_name: selectedClient?.country_name ?? '',
          receiver_city_name: selectedClient?.city_name ?? ''
        };

        if (isLegalClient) {
          formik.setValues({
            ...baseValues,
            receiver_company_name: selectedClient.company_name || '',
            receiver_bin: selectedClient.bin || '',
            receiver_first_name: '',
            receiver_last_name: '',
            receiver_patronymic: '',
            receiver_type: ClientType.LEGAL as IOrderFormValues['receiver_type']
          });
        } else {
          formik.setValues({
            ...baseValues,
            receiver_first_name: selectedClient.first_name || '',
            receiver_last_name: selectedClient.last_name || '',
            receiver_patronymic: selectedClient.patronymic || '',
            receiver_company_name: '',
            receiver_bin: '',
            receiver_type: ClientType.INDIVIDUAL as IOrderFormValues['receiver_type']
          });
        }
      }
    },
    [clientsData, specificClientData, formik]
  );

  useEffect(() => {
    if (isEditMode && mainFormData && countriesData && citiesData) {
      const countryName = countriesData.data.find(
        (c: any) => c.id === mainFormData.receiver_country_id
      )?.name;
      const cityName = citiesData.data[0]?.cities?.find(
        (c: any) => c.id === mainFormData.receiver_city_id
      )?.name;
      formik.setValues({
        ...formik.values,
        receiver_country_name: countryName || '',
        receiver_city_name: cityName || ''
      });
    }
  }, [isEditMode, mainFormData, countriesData, citiesData]);

  useEffect(() => {
    if (specificClientData?.result?.[0] && isInitialLoad && !isEditMode) {
      handleClientChange(String(specificClientData.result[0].id), specificClientData.result[0]);
      setIsInitialLoad(false);
    }
  }, [specificClientData, isInitialLoad, isEditMode, handleClientChange]);

  const handleCountryChange = useCallback(
    (val: string | number) => {
      const selectedCountry = countriesData?.data?.find((country) => country.id === val);
      formik.setFieldValue('receiver_country_id', val ? val : '');
      formik.setFieldValue('receiver_city_id', '');
      formik.setFieldValue('receiver_country_name', selectedCountry?.name ?? '');
      formik.setFieldValue('receiver_city_name', '');
    },
    [countriesData, formik]
  );

  const handleCityChange = useCallback(
    (val: string | number) => {
      const selectedCity = citiesData?.data[0]?.cities?.find((city) => city.id === val);
      formik.setFieldValue('receiver_city_id', val ? Number(val) : '');
      formik.setFieldValue('receiver_city_name', selectedCity?.name ?? '');
    },
    [citiesData, formik]
  );

  const handleClientTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newType = e.target.value as ClientType;
      const currentClientId = formik.values.receiver_contact_id;
      formik.setValues({
        ...formik.values,
        receiver_type: newType,
        receiver_first_name: newType === ClientType.LEGAL ? '' : formik.values.receiver_first_name,
        receiver_last_name: newType === ClientType.LEGAL ? '' : formik.values.receiver_last_name,
        receiver_patronymic: newType === ClientType.LEGAL ? '' : formik.values.receiver_patronymic,
        receiver_company_name:
          newType === ClientType.INDIVIDUAL ? '' : formik.values.receiver_company_name,
        receiver_bin: newType === ClientType.INDIVIDUAL ? '' : formik.values.receiver_bin,
        receiver_contact_id: currentClientId
      });
    },
    [formik]
  );

  const isFormLoading = countriesLoading || specificClientLoading || (isEditMode && citiesLoading);
  const isFormError =
    countriesIsError || clientsIsError || specificClientIsError || (isEditMode && citiesIsError);

  if (isFormLoading) return <SharedLoading simple />;

  if (isFormError) {
    const errors = [countriesError, clientsError, specificClientError, citiesError].filter(Boolean);

    return (
      <div className="space-y-2">
        {errors.map((error, index) => (
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
            value={formik.values.receiver_contact_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_CONTACT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CONTACT' })}
            onChange={(val) => handleClientChange(String(val))}
            error={formik.errors.receiver_contact_id as string}
            touched={formik.touched.receiver_contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
            loading={clientsLoading}
          />

          <SharedRadio
            name="receiver_type"
            label={formatMessage({ id: 'SYSTEM.CLIENT_TYPE' })}
            formik={formik}
            options={[
              {
                value: ClientType.INDIVIDUAL,
                label: formatMessage({ id: 'SYSTEM.CLIENT_TYPE_INDIVIDUAL' })
              },
              { value: ClientType.LEGAL, label: formatMessage({ id: 'SYSTEM.CLIENT_TYPE_LEGAL' }) }
            ]}
            disabled={!!formik.values.receiver_contact_id}
            onChange={handleClientTypeChange}
          />

          {formik.values.receiver_type === ClientType.LEGAL ? (
            <>
              <SharedInput
                name="receiver_company_name"
                label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="receiver_bin"
                label={formatMessage({ id: 'SYSTEM.BIN' })}
                formik={formik}
                type="number"
                maxlength={12}
              />
            </>
          ) : (
            <>
              <SharedInput
                name="receiver_first_name"
                label={formatMessage({ id: 'SYSTEM.FIRST_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="receiver_last_name"
                label={formatMessage({ id: 'SYSTEM.LAST_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="receiver_patronymic"
                label={formatMessage({ id: 'SYSTEM.PATRONYMIC' })}
                formik={formik}
              />
            </>
          )}
          <SharedIntlPhoneInput
            name="receiver_phone"
            label={formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
            formik={formik}
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
            value={formik.values.receiver_country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
            onChange={handleCountryChange}
            error={formik.errors.receiver_country_id as string}
            touched={formik.touched.receiver_country_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.CITY' })}
            value={formik.values.receiver_city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={
              citiesLoading
                ? formatMessage({ id: 'SYSTEM.LOADING' })
                : formik.values.sender_country_id
                  ? formatMessage({ id: 'SYSTEM.SELECT' })
                  : formatMessage({ id: 'SYSTEM.SELECT_COUNTRY_FIRST' })
            }
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CITY' })}
            onChange={handleCityChange}
            error={formik.errors.receiver_city_id as string}
            touched={formik.touched.receiver_city_id}
            searchTerm={citySearchTerm}
            onSearchTermChange={setCitySearchTerm}
            disabled={!formik.values.receiver_country_id}
            loading={citiesLoading}
            errorText={
              citiesIsError ? formatMessage({ id: 'SYSTEM.FAILED_LOAD_CITIES' }) : undefined
            }
            emptyText={formatMessage({ id: 'SYSTEM.NO_CITIES_AVAILABLE' })}
          />
          <SharedInput
            name="receiver_street"
            label={formatMessage({ id: 'SYSTEM.STREET' })}
            formik={formik}
          />
          <SharedInput
            name="receiver_house"
            label={formatMessage({ id: 'SYSTEM.HOUSE' })}
            formik={formik}
          />
          <SharedInput
            name="receiver_apartment"
            label={formatMessage({ id: 'SYSTEM.APARTMENT' })}
            formik={formik}
          />
          <SharedTextArea
            name="receiver_location_description"
            label={formatMessage({ id: 'SYSTEM.LOCATION_DESCRIPTION' })}
            formik={formik}
          />
          <SharedTextArea
            name="receiver_notes"
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

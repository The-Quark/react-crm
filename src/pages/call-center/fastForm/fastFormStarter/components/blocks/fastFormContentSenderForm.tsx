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
import {
  IFastFormContext,
  useFastFormContext
} from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';
import { Client } from '@/api/get/getClients/types.ts';
import { useIntl } from 'react-intl';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const formSchema = Yup.object().shape({
  first_name: Yup.string().when('type', {
    is: 'individual',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  last_name: Yup.string().when('type', {
    is: 'individual',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  patronymic: Yup.string().optional(),
  bin: Yup.string().when('type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'VALIDATION.FORM_VALIDATION_BIN_LENGTH')
        .matches(/^\d+$/, 'VALIDATION.FORM_VALIDATION_BIN_DIGITS')
        .required('VALIDATION.FORM_VALIDATION_BIN_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  company_name: Yup.string().when('type', {
    is: 'legal',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  city_id: Yup.number().required('VALIDATION.CITY_REQUIRED'),
  country_id: Yup.number().required('VALIDATION.COUNTRY_REQUIRED'),
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'VALIDATION.FORM_VALIDATION_PHONE_INVALID')
    .required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
  street: Yup.string().required('VALIDATION.STREET_REQUIRED'),
  house: Yup.string().required('VALIDATION.HOUSE_REQUIRED'),
  apartment: Yup.string().optional(),
  location_description: Yup.string().optional(),
  notes: Yup.string().optional()
});

const getInitialValues = (
  mainFormSender: ISenderOrderFormValues | null,
  mainForm: IFastFormContext | null
) => {
  if (mainForm) {
    return {
      first_name: mainFormSender?.first_name || mainForm.application?.first_name || '',
      last_name: mainFormSender?.last_name || mainForm.application?.last_name || '',
      patronymic: mainFormSender?.patronymic || mainForm.application?.patronymic || '',
      bin: mainFormSender?.bin || mainForm.application?.bin || '',
      company_name: mainFormSender?.company_name || mainForm.application?.company_name || '',
      type: mainFormSender?.type || mainForm.application?.client_type || 'individual',
      country_id: mainFormSender?.country_id ? Number(mainFormSender.country_id) : '',
      city_id: mainFormSender?.city_id ? Number(mainFormSender.city_id) : '',
      phone: mainFormSender?.phone || mainForm.application?.phone || '',
      street: mainFormSender?.street || '',
      house: mainFormSender?.house || '',
      apartment: mainFormSender?.apartment || '',
      location_description: mainFormSender?.location_description || '',
      notes: mainFormSender?.notes || '',
      contact_id: mainForm.application?.client_id || mainFormSender?.contact_id || ''
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
  const { formatMessage } = useIntl();
  const [searchTerm, setSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');

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
    initialValues: getInitialValues(
      mainForm?.order?.sender as ISenderOrderFormValues,
      mainForm as IFastFormContext
    ),
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

  const isFormLoading = countriesLoading;
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
            label={formatMessage({ id: 'SYSTEM.CONTACT' })}
            value={formik.values.contact_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_CONTACT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CONTACT' })}
            onChange={(val) => handleClientChange(String(val))}
            error={formik.errors.contact_id as string}
            touched={formik.touched.contact_id}
            searchTerm={clientSearchTerm}
            onSearchTermChange={setClientSearchTerm}
            loading={clientsLoading}
          />

          {formik.values.type === 'legal' ? (
            <>
              <SharedInput
                name="company_name"
                label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
                formik={formik}
              />
              <SharedInput name="bin" label={formatMessage({ id: 'SYSTEM.BIN' })} formik={formik} />
            </>
          ) : (
            <>
              <SharedInput
                name="first_name"
                label={formatMessage({ id: 'SYSTEM.FIRST_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="last_name"
                label={formatMessage({ id: 'SYSTEM.LAST_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="patronymic"
                label={formatMessage({ id: 'SYSTEM.PATRONYMIC' })}
                formik={formik}
              />
            </>
          )}

          <SharedInput
            name="phone"
            label={formatMessage({ id: 'SYSTEM.PHONE' })}
            formik={formik}
            type="tel"
          />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
            value={formik.values.country_id ?? ''}
            options={countriesData?.data ?? []}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
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
            label={formatMessage({ id: 'SYSTEM.CITY' })}
            value={formik.values.city_id ?? ''}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={
              formik.values.city_id
                ? formatMessage({ id: 'SYSTEM.SELECT' })
                : formatMessage({ id: 'SYSTEM.SELECT_COUNTRY_FIRST' })
            }
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CITY' })}
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
            errorText={
              citiesIsError ? formatMessage({ id: 'SYSTEM.FAILED_LOAD_CITIES' }) : undefined
            }
            emptyText={formatMessage({ id: 'SYSTEM.NO_CITIES_AVAILABLE' })}
          />

          <SharedInput
            name="street"
            label={formatMessage({ id: 'SYSTEM.STREET' })}
            formik={formik}
          />
          <SharedInput name="house" label={formatMessage({ id: 'SYSTEM.HOUSE' })} formik={formik} />
          <SharedInput
            name="apartment"
            label={formatMessage({ id: 'SYSTEM.APARTMENT' })}
            formik={formik}
          />

          <SharedTextArea
            name="location_description"
            label={formatMessage({ id: 'SYSTEM.LOCATION_DESCRIPTION' })}
            formik={formik}
          />
          <SharedTextArea
            name="notes"
            label={formatMessage({ id: 'SYSTEM.NOTES' })}
            formik={formik}
          />

          <div className="flex justify-between">
            <button className="btn btn-light" onClick={onBack}>
              {formatMessage({ id: 'SYSTEM.BACK' })}
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formatMessage({ id: 'SYSTEM.NEXT' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { postApplication, getSources, putApplication, getClients, getBoxTypes } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedRadio,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { ApplicationsStatus } from '@/api/enums';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockApplicationsStatusOptions } from '@/utils/enumsOptions/mocks.ts';
import { debounce } from '@/utils/lib/helpers.ts';
import { BIN_LENGTH, PHONE_REG_EXP, SEARCH_DEBOUNCE_DELAY, SEARCH_PER_PAGE } from '@/utils';
import { Divider } from '@mui/material';

interface Props {
  isEditMode: boolean;
  applicationData?: Application;
  applicationId?: number;
}

export const formSchema = Yup.object().shape({
  first_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  last_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  bin: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'VALIDATION.FORM_VALIDATION_BIN_LENGTH')
        .matches(/^\d+$/, 'VALIDATION.FORM_VALIDATION_BIN_DIGITS')
        .required('VALIDATION.FORM_VALIDATION_BIN_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  company_name: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  source: Yup.string().required('VALIDATION.FORM_VALIDATION_SOURCE_REQUIRED'),
  client_type: Yup.string().required('VALIDATION.FORM_VALIDATION_CLIENT_TYPE_REQUIRED'),
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'VALIDATION.FORM_VALIDATION_PHONE_INVALID')
    .required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
  email: Yup.string().email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID').optional(),
  client_id: Yup.string().optional().nullable()
});

const getInitialValues = (
  isEditMode: boolean,
  applicationData: Application,
  clientId: string | null
): IApplicationPostFormValues => {
  if (isEditMode && applicationData) {
    return {
      email: applicationData.client?.email || '',
      bin: applicationData.client?.bin || '',
      phone: applicationData.client?.phone || '',
      message: applicationData.message || '',
      source: applicationData.source.code || 'insta',
      first_name: applicationData.client?.first_name || '',
      last_name: applicationData.client?.last_name || '',
      patronymic: applicationData.client?.patronymic || '',
      company_name: applicationData.client?.company_name || '',
      client_type: applicationData.client?.type || 'individual',
      client_id: applicationData.client_id || clientId,
      weight: applicationData?.weight?.toString() ?? '',
      width: applicationData?.width?.toString() ?? '',
      length: applicationData?.length?.toString() ?? '',
      height: applicationData?.height?.toString() ?? '',
      box_type_id: applicationData?.box_type_id?.toString() ?? '',
      box_width: applicationData?.box_width?.toString() ?? '',
      box_length: applicationData?.box_length?.toString() ?? '',
      box_height: applicationData?.box_height?.toString() ?? '',
      country_of_arrival: applicationData.country_of_arrival?.toString() ?? '',
      country_of_departure: applicationData.country_of_departure?.toString() ?? '',
      status: applicationData.status || ('new' as unknown as ApplicationsStatus)
    };
  }
  return {
    email: '',
    phone: '',
    message: '',
    source: '',
    first_name: '',
    last_name: '',
    patronymic: '',
    company_name: '',
    bin: '',
    client_type: 'individual',
    client_id: clientId ?? '',
    weight: '',
    width: '',
    length: '',
    height: '',
    box_type_id: '',
    box_width: '',
    box_length: '',
    box_height: '',
    country_of_arrival: '',
    country_of_departure: '',
    status: 'new' as unknown as ApplicationsStatus
  };
};

export const ApplicationsStarterContent = ({
  isEditMode,
  applicationId,
  applicationData
}: Props) => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchBoxTypeTerm, setSearchBoxTypeTerm] = useState('');

  const clientId = searchParams.get('client_id');

  const resetClientFields = useCallback(() => {
    return {
      first_name: '',
      last_name: '',
      patronymic: '',
      company_name: '',
      bin: '',
      client_type: 'individual',
      phone: '',
      email: '',
      source: '',
      client_id: ''
    };
  }, []);

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources({ is_active: true })
  });

  const {
    data: boxTypesData,
    isLoading: boxTypesLoading,
    isError: boxTypesIsError,
    error: boxTypesError
  } = useQuery({
    queryKey: ['cargoBoxTypes'],
    queryFn: () => getBoxTypes({})
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['applicationClients', searchTerm],
    queryFn: () => getClients({ search_application: searchTerm, per_page: SEARCH_PER_PAGE })
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, applicationData || ({} as Application), clientId),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      const payload = {
        ...values,
        ...(values.client_type === 'individual' && {
          company_name: undefined,
          bin: undefined
        }),
        ...(values.client_type === 'legal' && {
          first_name: undefined,
          last_name: undefined,
          patronymic: undefined
        })
      };
      try {
        if (isEditMode && applicationId) {
          const { status, ...putData } = payload;
          await putApplication(Number(applicationId), {
            ...putData,
            status: status as ApplicationsStatus
          });
        } else {
          await postApplication(payload);
        }
        await queryClient.invalidateQueries({ queryKey: ['applications'] });
        resetForm();
        setSearchTerm('');
        setInputValue('');
        navigate('/call-center/applications/list');
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
    data: clientData,
    isLoading: clientLoading,
    isError: clientIsError,
    error: clientError
  } = useQuery({
    queryKey: ['clientDetails', formik.values.client_id],
    queryFn: () =>
      getClients({ id: formik.values.client_id ? Number(formik.values.client_id) : undefined }),
    enabled: !!formik.values.client_id && !isNaN(Number(formik.values.client_id))
  });

  const debouncedSetSearchTerm = useMemo(
    () => debounce((term: string) => setSearchTerm(term), SEARCH_DEBOUNCE_DELAY),
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedSetSearchTerm(value);
    },
    [debouncedSetSearchTerm]
  );

  const handleClientChange = useCallback(
    (val: string | number | null) => {
      if (formik.values.client_id === val) return;
      formik.setFieldValue('client_id', val ?? '');
      if (val === null || val === '') {
        const resetFields = resetClientFields();
        Object.entries(resetFields).forEach(([field, value]) => {
          formik.setFieldValue(field, value);
        });
      }
    },
    [formik, resetClientFields]
  );

  const handleClientTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newType = e.target.value as 'individual' | 'legal';
      const currentClientId = formik.values.client_id;
      formik.resetForm();
      formik.setFieldValue('client_type', newType);
      if (currentClientId) {
        formik.setFieldValue('client_id', currentClientId);
      }
    },
    [formik]
  );

  const handleBoxTypeChange = useCallback(
    (boxTypeId: string | number) => {
      if (boxTypeId === '' || boxTypeId === '__clear__') {
        formik.setValues({
          ...formik.values,
          box_type_id: '',
          box_width: '',
          box_height: '',
          box_length: ''
        });
        return;
      }
      const id = typeof boxTypeId === 'number' ? boxTypeId.toString() : boxTypeId;
      const selectedBoxType = boxTypesData?.result?.find((box) => box.id === Number(id));
      if (selectedBoxType) {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          box_width: selectedBoxType.width?.toString() ?? '',
          box_height: selectedBoxType.height?.toString() ?? '',
          box_length: selectedBoxType.length?.toString() ?? ''
        });
      } else {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          box_width: '',
          box_height: '',
          box_length: ''
        });
      }
    },
    [formik, boxTypesData?.result]
  );

  useEffect(() => {
    if (!clientData?.result?.[0] || !formik.values.client_id) return;

    const client = clientData.result[0];
    const currentValues = formik.values;

    const fieldsToUpdate = {
      first_name: client.first_name || '',
      last_name: client.last_name || '',
      patronymic: client.patronymic || '',
      company_name: client.company_name || '',
      client_type: client.type || 'individual',
      phone: client.phone || '',
      email: client.email || '',
      source: client.source?.code || '',
      bin: client.bin || ''
    };

    const hasChanges = Object.entries(fieldsToUpdate).some(
      ([key, value]) => currentValues[key as keyof typeof currentValues] !== value
    );

    if (hasChanges) {
      formik.setValues((prevValues) => ({
        ...prevValues,
        ...fieldsToUpdate
      }));
    }
  }, [clientData?.result, formik.values.client_id]);

  const isLoading = sourcesLoading || clientLoading;

  const renderError = () => {
    if (sourcesIsError) return <SharedError error={sourcesError} />;
    if (clientsIsError) return <SharedError error={clientsError} />;
    if (clientIsError) return <SharedError error={clientError} />;
    if (boxTypesIsError) return <SharedError error={boxTypesError} />;
    return null;
  };

  if (isLoading) {
    return <SharedLoading simple />;
  }

  const errorComponent = renderError();
  if (errorComponent) {
    return errorComponent;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode
              ? formatMessage({ id: 'SYSTEM.EDIT' })
              : formatMessage({ id: 'SYSTEM.NEW_APPLICATION' })}
          </h3>
        </div>

        <div className="card-body grid gap-5">
          {!isEditMode && (
            <>
              <SharedAutocomplete
                label={formatMessage({ id: 'SYSTEM.CLIENT' })}
                value={formik.values.client_id ?? ''}
                options={
                  clientsData?.result?.map((client) => ({
                    id: client.id,
                    name: client.search_application ?? ''
                  })) ?? []
                }
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_CLIENT' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CLIENT' })}
                onChange={handleClientChange}
                error={formik.errors.client_id as string}
                touched={formik.touched.client_id}
                searchTerm={inputValue}
                onSearchTermChange={handleSearchChange}
                loading={clientsLoading || clientLoading}
              />
              <SharedRadio
                name="client_type"
                label={formatMessage({ id: 'SYSTEM.CLIENT_TYPE' })}
                formik={formik}
                options={[
                  {
                    value: 'individual',
                    label: formatMessage({ id: 'SYSTEM.CLIENT_TYPE_INDIVIDUAL' })
                  },
                  { value: 'legal', label: formatMessage({ id: 'SYSTEM.CLIENT_TYPE_LEGAL' }) }
                ]}
                disabled={!!formik.values.client_id}
                onChange={handleClientTypeChange}
              />
            </>
          )}
          {formik.values.client_type === 'legal' && (
            <>
              <SharedInput
                name="company_name"
                label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
                formik={formik}
              />
              <SharedInput
                name="bin"
                label={formatMessage({ id: 'SYSTEM.BIN' })}
                formik={formik}
                type="number"
                maxlength={12}
              />
            </>
          )}
          {formik.values.client_type === 'individual' && (
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
            label={formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
            formik={formik}
            type="tel"
          />
          <SharedSelect
            name="source"
            label={formatMessage({ id: 'SYSTEM.SOURCE' })}
            formik={formik}
            options={
              sourcesData?.result?.map((source) => ({ label: source.name, value: source.code })) ||
              []
            }
          />
          <SharedInput
            name="email"
            label={formatMessage({ id: 'SYSTEM.EMAIL' })}
            formik={formik}
            type="email"
          />
          <SharedTextArea
            name="message"
            label={formatMessage({ id: 'SYSTEM.MESSAGE' })}
            formik={formik}
          />
          {isEditMode && (
            <SharedSelect
              name="status"
              label={formatMessage({ id: 'SYSTEM.STATUS' })}
              formik={formik}
              options={mockApplicationsStatusOptions.map((opt) => ({
                label: opt.name,
                value: opt.value
              }))}
            />
          )}
          <Divider />
          <h3 className="card-title">{formatMessage({ id: 'SYSTEM.ROUTE' })}</h3>
          <SharedInput
            name="country_of_departure"
            label={formatMessage({ id: 'SYSTEM.COUNTRY_OF_DEPARTURE' })}
            formik={formik}
          />
          <SharedInput
            name="country_of_arrival"
            label={formatMessage({ id: 'SYSTEM.COUNTRY_OF_ARRIVAL' })}
            formik={formik}
          />
          <Divider />
          <h3 className="card-title">{formatMessage({ id: 'SYSTEM.SIZES' })}</h3>
          <SharedDecimalInput
            name="weight"
            label={formatMessage({ id: 'SYSTEM.WEIGHT' }) + ' (kg)'}
            formik={formik}
          />
          <SharedDecimalInput
            name="width"
            label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
            formik={formik}
          />
          <SharedDecimalInput
            name="length"
            label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
            formik={formik}
          />
          <SharedDecimalInput
            name="height"
            label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
            formik={formik}
          />
          <Divider />
          <h3 className="card-title">{formatMessage({ id: 'SYSTEM.BOX_TYPE' })}</h3>
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.BOX_TYPE' })}
            value={formik.values.box_type_id ?? ''}
            options={
              boxTypesData?.result?.map((app) => ({
                id: app.id,
                name: String(app.name || app.id)
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_BOX_TYPE' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_BOX_TYPE' })}
            onChange={handleBoxTypeChange}
            error={formik.errors.box_type_id as string}
            touched={formik.touched.box_type_id}
            searchTerm={searchBoxTypeTerm}
            onSearchTermChange={setSearchBoxTypeTerm}
            loading={boxTypesLoading}
          />
          <SharedDecimalInput
            name="box_width"
            label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
            formik={formik}
            disabled={!!formik.values.box_type_id}
          />
          <SharedDecimalInput
            name="box_length"
            label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
            formik={formik}
            disabled={!!formik.values.box_type_id}
          />
          <SharedDecimalInput
            name="box_height"
            label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
            formik={formik}
            disabled={!!formik.values.box_type_id}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading
                ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                : formatMessage({ id: 'SYSTEM.SAVE' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

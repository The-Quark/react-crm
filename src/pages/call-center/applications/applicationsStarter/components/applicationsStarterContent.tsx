import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { postApplication, getSources, putApplication, getClients, getBoxTypes } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { FormikProvider, useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { ApplicationsStatus, ClientType } from '@/api/enums';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from '@/utils/lib/helpers.ts';
import { BIN_LENGTH, SEARCH_DEBOUNCE_DELAY, SEARCH_PER_PAGE } from '@/utils';
import { Divider } from '@mui/material';
import { ApplicationsClientBlock } from '@/pages/call-center/applications/applicationsStarter/components/blocks/applicationsClientBlock.tsx';
import { ApplicationsContactBlock } from '@/pages/call-center/applications/applicationsStarter/components/blocks/applicationsContactBlock.tsx';
import { ApplicationsRouteBlock } from '@/pages/call-center/applications/applicationsStarter/components/blocks/applicationsRouteBlock.tsx';
import { ApplicationsDimensionBlock } from '@/pages/call-center/applications/applicationsStarter/components/blocks/applicationsDimensionBlock.tsx';

interface Props {
  isEditMode: boolean;
  applicationData?: Application;
  applicationId?: number;
}

export const formSchema = Yup.object().shape({
  first_name: Yup.string().when('client_type', {
    is: ClientType.INDIVIDUAL,
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  last_name: Yup.string().when('client_type', {
    is: ClientType.INDIVIDUAL,
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  bin: Yup.string().when('client_type', {
    is: ClientType.LEGAL,
    then: (schema) =>
      schema
        .length(BIN_LENGTH, 'VALIDATION.FORM_VALIDATION_BIN_LENGTH')
        .matches(/^\d+$/, 'VALIDATION.FORM_VALIDATION_BIN_DIGITS')
        .required('VALIDATION.FORM_VALIDATION_BIN_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  company_name: Yup.string().when('client_type', {
    is: ClientType.LEGAL,
    then: (schema) => schema.required('VALIDATION.FORM_VALIDATION_COMPANY_NAME_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  source: Yup.string().required('VALIDATION.FORM_VALIDATION_SOURCE_REQUIRED'),
  client_type: Yup.string().required('VALIDATION.FORM_VALIDATION_CLIENT_TYPE_REQUIRED'),
  phone: Yup.string().required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
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
      email: applicationData?.email || '',
      bin: applicationData?.bin || '',
      phone: applicationData?.phone || '',
      message: applicationData.message || '',
      source: applicationData.source.code || 'insta',
      first_name: applicationData?.first_name || '',
      last_name: applicationData?.last_name || '',
      patronymic: applicationData?.patronymic || '',
      company_name: applicationData?.company_name || '',
      client_type: applicationData?.client_type || 'individual',
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
    client_type: ClientType.INDIVIDUAL,
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

  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');

  const clientId = searchParams.get('client_id');

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
      const payload = {
        ...values,
        ...(values.client_type === ClientType.INDIVIDUAL && {
          company_name: undefined,
          bin: undefined
        }),
        ...(values.client_type === ClientType.LEGAL && {
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

  useEffect(() => {
    if (!clientData?.result?.[0] || !formik.values.client_id) return;

    const client = clientData.result[0];
    const currentValues = formik.values;

    const fieldsToUpdate = {
      first_name: client.first_name || '',
      last_name: client.last_name || '',
      patronymic: client.patronymic || '',
      company_name: client.company_name || '',
      client_type: client.type || ClientType.INDIVIDUAL,
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

  const isLoading = sourcesLoading || clientsLoading || boxTypesLoading || clientLoading;

  const renderError = () => {
    if (sourcesIsError) return <SharedError error={sourcesError} />;
    if (clientsIsError) return <SharedError error={clientsError} />;
    if (clientIsError) return <SharedError error={clientError} />;
    if (boxTypesIsError) return <SharedError error={boxTypesError} />;
    return null;
  };

  const errorComponent = renderError();
  if (errorComponent) {
    return errorComponent;
  }

  return (
    <FormikProvider value={formik}>
      <div className="grid gap-5 lg:gap-7.5">
        <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
          <div className="card-header" id="general_settings">
            <h3 className="card-title">
              {isEditMode
                ? formatMessage({ id: 'SYSTEM.EDIT' })
                : formatMessage({ id: 'SYSTEM.NEW_APPLICATION' })}
            </h3>
          </div>
          {isLoading ? (
            <SharedLoading simple />
          ) : (
            <div className="card-body grid gap-5">
              <ApplicationsClientBlock
                isEditMode={isEditMode}
                clientsData={clientsData?.result}
                clientLoading={clientsLoading || clientLoading}
                onSearchChange={handleSearchChange}
                searchTerm={inputValue}
              />
              <ApplicationsContactBlock isEditMode={isEditMode} sourcesData={sourcesData?.result} />
              <Divider />
              <ApplicationsRouteBlock />
              <Divider />
              <ApplicationsDimensionBlock
                boxTypesLoading={boxTypesLoading}
                boxTypesData={boxTypesData?.result}
              />
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                  {formik.isSubmitting
                    ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                    : formatMessage({ id: 'SYSTEM.SAVE' })}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </FormikProvider>
  );
};

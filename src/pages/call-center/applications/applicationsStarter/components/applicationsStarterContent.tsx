import { postApplication, getSources, putApplication, getClients } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postApplication/types.ts';
import { Application } from '@/api/get/getApplications/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedRadio,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { ApplicationsStatus } from '@/api/enums';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockApplicationsStatusOptions } from '@/lib/mocks.ts';

interface Props {
  isEditMode: boolean;
  applicationData?: Application;
  applicationId?: number;
}

export const formSchema = Yup.object().shape({
  first_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('First name is required'),
    otherwise: (schema) => schema.optional()
  }),
  last_name: Yup.string().when('client_type', {
    is: 'individual',
    then: (schema) => schema.required('Last name is required'),
    otherwise: (schema) => schema.optional()
  }),
  patronymic: Yup.string().optional(),
  company_name: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.optional()
  }),
  source: Yup.string().required('Source is required'),
  client_type: Yup.string().required('Client type is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  email: Yup.string().email('Invalid email address').optional(),
  client_id: Yup.string().optional().nullable(),
  message: Yup.string().optional(),
  status: Yup.string().optional()
});

const getInitialValues = (
  isEditMode: boolean,
  applicationData: Application,
  clientId: string
): IApplicationPostFormValues => {
  if (isEditMode && applicationData) {
    return {
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      message: applicationData.message || '',
      source: applicationData.source.code || 'insta',
      first_name: applicationData.first_name || '',
      last_name: applicationData.last_name || '',
      patronymic: applicationData.patronymic || '',
      company_name: applicationData.company_name || '',
      client_type: applicationData.client_type || 'individual',
      client_id: applicationData.client_id || clientId.toString(),
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
    client_type: 'individual',
    client_id: clientId ?? '',
    status: 'new' as unknown as ApplicationsStatus
  };
};

export const ApplicationsStarterContent = ({
  isEditMode,
  applicationId,
  applicationData
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client_id');

  const resetClientFields = useCallback(() => {
    return {
      first_name: '',
      last_name: '',
      patronymic: '',
      company_name: '',
      client_type: 'individual',
      phone: '',
      email: '',
      source: ''
    };
  }, []);

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['applicationClients'],
    queryFn: () => getClients(),
    staleTime: 60 * 60 * 1000
  });

  const formik = useFormik({
    initialValues: getInitialValues(
      isEditMode,
      applicationData || ({} as Application),
      String(clientId)
    ),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && applicationId) {
          const { status, ...putData } = values;
          await putApplication(Number(applicationId), {
            ...putData,
            status: status as ApplicationsStatus
          });
          queryClient.invalidateQueries({ queryKey: ['applications'] });
          navigate('/call-center/applications/list');
          resetForm();
          setSearchTerm('');
        } else {
          await postApplication(values);
          queryClient.invalidateQueries({ queryKey: ['applications'] });
          navigate('/call-center/applications/list');
          resetForm();
          setSearchTerm('');
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientIsError,
    error: clientError
  } = useQuery({
    queryKey: ['clientDetails', formik.values.client_id],
    queryFn: () => getClients({ id: formik.values.client_id?.toString() ?? '' }),
    staleTime: 60 * 60 * 1000,
    enabled: !!formik.values.client_id && isEditMode
  });

  const handleClientChange = useCallback(
    (val: string | number | null) => {
      formik.setFieldValue('client_id', val ?? '');

      if (val === null || val === '') {
        const resetFields = resetClientFields();
        Object.entries(resetFields).forEach(([field, value]) => {
          formik.setFieldValue(field, value);
        });
        formik.setFieldValue('company_name', '');
      }
    },
    [formik, resetClientFields]
  );

  useEffect(() => {
    if (clientData?.result?.[0] && !isEditMode && formik.values.client_id) {
      const client = clientData.result[0];
      formik.setValues((prevValues) => ({
        ...prevValues,
        first_name: client.first_name || '',
        last_name: client.last_name || '',
        patronymic: client.patronymic || '',
        company_name: client.company_name || '',
        client_type: client.type || 'individual',
        phone: client.phone || '',
        email: client.email || '',
        source: client.source?.code || ''
      }));
    }
  }, [clientData, isEditMode, formik]);

  const isLoading = sourcesLoading || clientsLoading || clientLoading;

  if (isLoading) {
    return <SharedLoading />;
  }

  if (sourcesIsError) {
    return <SharedError error={sourcesError} />;
  }

  if (clientsIsError) {
    return <SharedError error={clientsError} />;
  }

  if (clientIsError) {
    return <SharedError error={clientError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">{isEditMode ? 'Edit Application' : 'New Application'}</h3>
        </div>

        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Client"
            value={formik.values.client_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name:
                  (client.first_name &&
                    `${client?.first_name} ${client?.last_name}  ${client?.patronymic}`) ||
                  client.company_name
              })) ?? []
            }
            placeholder="Select client"
            searchPlaceholder="Search client"
            onChange={handleClientChange}
            error={formik.errors.client_id as string}
            touched={formik.touched.client_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            loading={clientsLoading || clientLoading}
          />

          <SharedRadio
            name="client_type"
            label="Client Type"
            formik={formik}
            options={[
              { value: 'individual', label: 'Individual' },
              { value: 'legal', label: 'Legal' }
            ]}
            disabled={!!formik.values.client_id}
          />

          {formik.values.client_type === 'legal' ? (
            <SharedInput name="company_name" label="Company name" formik={formik} />
          ) : (
            <>
              <SharedInput name="first_name" label="First name" formik={formik} />
              <SharedInput name="last_name" label="Last name" formik={formik} />
              <SharedInput name="patronymic" label="Patronymic" formik={formik} />
            </>
          )}

          <SharedInput name="phone" label="Phone number" formik={formik} type="tel" />

          <SharedSelect
            name="source"
            label="Source"
            formik={formik}
            options={
              sourcesData?.result?.map((source) => ({ label: source.name, value: source.code })) ||
              []
            }
          />

          <SharedInput name="email" label="Email" formik={formik} type="email" />
          <SharedTextArea name="message" label="Message" formik={formik} />

          {isEditMode && (
            <SharedSelect
              name="status"
              label="Status"
              formik={formik}
              options={mockApplicationsStatusOptions.map((opt) => ({
                label: opt.name,
                value: opt.value
              }))}
            />
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

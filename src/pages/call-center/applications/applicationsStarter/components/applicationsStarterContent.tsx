import { postApplication, getApplications, getSources, putApplication, getClients } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postApplication/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useParams } from 'react-router';
import { ApplicationsStatus } from '@/api/enums';
import { useNavigate } from 'react-router-dom';
import { mockApplicationsStatusOptions } from '@/lib/mocks.ts';

export const formSchema = Yup.object().shape({
  source: Yup.string().required('Source is required'),
  full_name: Yup.string().required('Full name is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  client_id: Yup.string().optional(),
  email: Yup.string().email('Invalid email address').optional(),
  message: Yup.string().optional(),
  status: Yup.string().optional()
});

export const ApplicationsStarterContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const clientId = localStorage.getItem('clientID') || '';

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

  const {
    data: applicationData,
    isLoading: applicationLoading,
    isError: applicationIsError,
    error: applicationError
  } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplications(id ? parseInt(id) : undefined),
    enabled: isEditMode
  });

  const initialValues: IApplicationPostFormValues & { status?: ApplicationsStatus } = {
    email: '',
    phone: '',
    message: '',
    source: '',
    full_name: '',
    client_id: clientId,
    ...(isEditMode && { status: 'new' as unknown as ApplicationsStatus })
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && id) {
          const { status, ...putData } = values;
          await putApplication(Number(id), { ...putData, status: status as ApplicationsStatus });
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
    enabled: !!formik.values.client_id && !isEditMode
  });

  useEffect(() => {
    if (clientData?.result?.[0] && !isEditMode) {
      const client = clientData.result[0];
      formik.setValues((prevValues) => ({
        ...prevValues,
        phone: client.phone || prevValues.phone,
        email: client.email || prevValues.email,
        source: client.source?.code || prevValues.source
      }));
    }
  }, [clientData, isEditMode]);

  useEffect(() => {
    if (isEditMode && applicationData?.result?.[0]) {
      const appData = applicationData.result[0];
      formik.setValues({
        email: appData.email ?? '',
        phone: appData.phone,
        message: appData.message ?? '',
        source: String(appData.source?.code ?? 'insta'),
        full_name: appData.full_name,
        client_id: appData.client_id ?? '',
        status: appData.status as ApplicationsStatus
      });
    } else if (!isEditMode) {
      formik.resetForm();
    }
  }, [isEditMode, applicationData]);

  if (sourcesLoading || clientsLoading || (isEditMode && applicationLoading)) {
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

  if (isEditMode && applicationIsError) {
    return <SharedError error={applicationError} />;
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
            onChange={(val) => {
              formik.setFieldValue('client_id', val);
            }}
            error={formik.errors.client_id as string}
            touched={formik.touched.client_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          <SharedInput name="full_name" label="Full name" formik={formik} />
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

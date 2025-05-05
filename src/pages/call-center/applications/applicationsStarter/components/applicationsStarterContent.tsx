import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { postApplication, getApplications, getSources, putApplication, getClients } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postApplication/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useParams } from 'react-router';
import { ApplicationsStatus } from '@/api/get/getApplications/types.ts';
import { useNavigate } from 'react-router-dom';

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
    client_id: '',
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

  useEffect(() => {
    formik.resetForm();
    if (applicationData && isEditMode) {
      formik.setValues(
        {
          email: applicationData.result[0].email ?? '',
          phone: applicationData.result[0].phone,
          message: applicationData.result[0].message ?? '',
          source: String(applicationData.result[0].source.code ?? 'insta'),
          full_name: applicationData.result[0].full_name,
          client_id: applicationData.result[0].client_id ?? '',
          status: applicationData.result[0].status as unknown as ApplicationsStatus
        },
        false
      );
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
          <SharedInput name="message" label="Message" formik={formik} />
          <SharedAutocomplete
            label="Client"
            value={formik.values.client_id ?? ''}
            options={
              clientsData?.result?.map((app) => ({
                id: app.id,
                name: app.first_name || app.company_name
              })) ?? []
            }
            placeholder="Select client"
            searchPlaceholder="Search application"
            onChange={(val) => {
              formik.setFieldValue('client_id', val);
            }}
            error={formik.errors.client_id as string}
            touched={formik.touched.client_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          {isEditMode && (
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Status</label>
              <div className="flex columns-1 w-full flex-wrap">
                <Select
                  value={(formik.values.status as unknown as string) || 'new'}
                  onValueChange={(value) => formik.setFieldValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.status}
                  </span>
                )}
              </div>
            </div>
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

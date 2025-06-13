import { getSources, getClients } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { useQuery } from '@tanstack/react-query';
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
import { useFastFormContext } from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';

interface Props {
  onNext: () => void;
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
  bin: Yup.string().when('client_type', {
    is: 'legal',
    then: (schema) =>
      schema
        .length(12, 'BIN must be exactly 12 digits')
        .matches(/^\d+$/, 'BIN must contain only digits')
        .required('Bin is required'),
    otherwise: (schema) => schema.optional()
  }),
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
  message: Yup.string().optional()
});

const getInitialValues = (
  applicationData: IApplicationPostFormValues
): IApplicationPostFormValues => {
  if (applicationData) {
    return {
      email: applicationData.email || '',
      bin: applicationData.bin || '',
      phone: applicationData.phone || '',
      message: applicationData.message || '',
      source: applicationData.source || 'insta',
      first_name: applicationData.first_name || '',
      last_name: applicationData.last_name || '',
      patronymic: applicationData.patronymic || '',
      company_name: applicationData.company_name || '',
      client_type: applicationData.client_type || 'individual',
      client_id: applicationData.client_id || ''
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
    client_id: ''
  };
};

export const FastFormContentApplicationForm = ({ onNext }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { mainForm, setMainForm } = useFastFormContext();

  console.log('Application mainForm: ', mainForm);

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
    queryFn: () => getSources({}),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['fastFormClients', searchTerm],
    queryFn: () => getClients({}),
    staleTime: 60 * 60 * 1000
  });

  const formik = useFormik({
    initialValues: getInitialValues(mainForm?.application as IApplicationPostFormValues),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setMainForm({
          ...mainForm,
          application: {
            ...values
          }
        });
        onNext();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setSubmitting(false);
    }
  });

  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientIsError,
    error: clientError
  } = useQuery({
    queryKey: ['fastFormClientDetails', formik.values.client_id],
    queryFn: () =>
      getClients({ id: formik.values.client_id ? Number(formik.values.client_id) : undefined }),
    staleTime: 60 * 60 * 1000,
    enabled: !!formik.values.client_id
  });

  const handleClientChange = useCallback(
    (val: string | number | null) => {
      if (formik.values.client_id === val) return;
      formik.setFieldValue('client_id', val ?? '');
      if (val === null || val === '') {
        const resetFields = resetClientFields();
        Object.entries(resetFields).forEach(([field, value]) => {
          formik.setFieldValue(field, value);
        });
        formik.setFieldValue('company_name', '');
      }
    },
    [formik, resetClientFields, formik.values.client_id]
  );

  useEffect(() => {
    if (clientData?.result?.[0] && formik.values.client_id) {
      const client = clientData.result[0];

      const shouldUpdate =
        formik.values.first_name !== (client.first_name || '') ||
        formik.values.last_name !== (client.last_name || '') ||
        formik.values.patronymic !== (client.patronymic || '') ||
        formik.values.company_name !== (client.company_name || '') ||
        formik.values.client_type !== (client.type || 'individual') ||
        formik.values.phone !== (client.phone || '') ||
        formik.values.email !== (client.email || '') ||
        formik.values.source !== (client.source?.code || '');

      if (shouldUpdate) {
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
    }
  }, [clientData, formik.values.client_id]);

  const isLoading = sourcesLoading || clientsLoading || clientLoading;

  if (isLoading) {
    return <SharedLoading simple />;
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
      <form className="pb-2.5" onSubmit={formik.handleSubmit} noValidate>
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
            <>
              <SharedInput name="company_name" label="Company name" formik={formik} />
              <SharedInput name="bin" label="BIN" formik={formik} type="number" maxlength={12} />
            </>
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

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

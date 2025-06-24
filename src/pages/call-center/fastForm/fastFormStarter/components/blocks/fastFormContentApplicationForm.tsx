import { getSources, getClients } from '@/api';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import {
  CACHE_TIME,
  cleanValues,
  debounce,
  PHONE_REG_EXP,
  SEARCH_DEBOUNCE_DELAY,
  SEARCH_PER_PAGE
} from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [inputValue, setInputValue] = useState('');
  const { mainForm, setMainForm } = useFastFormContext();

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
    queryFn: () => getSources({ is_active: true }),
    staleTime: CACHE_TIME
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['fastFormClients', searchTerm],
    queryFn: () => getClients({ search_application: searchTerm, per_page: SEARCH_PER_PAGE }),
    staleTime: CACHE_TIME
  });

  const formik = useFormik({
    initialValues: getInitialValues(mainForm?.application as IApplicationPostFormValues),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const cleanData = cleanValues(values);
      try {
        setMainForm({
          ...mainForm,
          application: {
            ...(cleanData as IApplicationPostFormValues)
          }
        });
        setSearchTerm('');
        setInputValue('');
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
    staleTime: CACHE_TIME,
    enabled: !!formik.values.client_id
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
    [formik, resetClientFields, formik.values.client_id]
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
      <form className="pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Client"
            value={formik.values.client_id ?? ''}
            options={
              clientsData?.result?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder="Select client"
            searchPlaceholder="Search client"
            onChange={handleClientChange}
            error={formik.errors.client_id as string}
            touched={formik.touched.client_id}
            searchTerm={inputValue}
            onSearchTermChange={handleSearchChange}
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
            onChange={handleClientTypeChange}
          />

          <>
            {formik.values.client_type === 'legal' && (
              <>
                <SharedInput name="company_name" label="Company name" formik={formik} />
                <SharedInput name="bin" label="BIN" formik={formik} type="number" maxlength={12} />
              </>
            )}
            {formik.values.client_type === 'individual' && (
              <>
                <SharedInput name="first_name" label="First name" formik={formik} />
                <SharedInput name="last_name" label="Last name" formik={formik} />
                <SharedInput name="patronymic" label="Patronymic" formik={formik} />
              </>
            )}
          </>

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

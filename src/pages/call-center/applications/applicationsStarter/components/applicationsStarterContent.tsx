import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { postApplication, getSources } from '@/api';
import { IApplicationFormValues } from '@/api/post/postApplication/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const formSchema = Yup.object().shape({
  source: Yup.string().required('Source is required'),
  full_name: Yup.string().required('Full name is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  client_id: Yup.number().optional(),
  email: Yup.string().email('Invalid email address').optional(),
  message: Yup.string().optional()
});

export const ApplicationsStarterContent = () => {
  const [loading, setLoading] = useState(false);

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const initialValues: IApplicationFormValues = {
    email: undefined,
    phone: '',
    message: undefined,
    source: '',
    full_name: '',
    client_id: undefined
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        await postApplication(values);
        resetForm();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  if (sourcesIsError) {
    return <SharedError error={sourcesError} />;
  }

  return sourcesLoading ? (
    <SharedLoading />
  ) : (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">Application</h3>
        </div>

        <div className="card-body grid gap-5">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Full name</label>
            <div className="flex columns-1 w-full flex-wrap">
              <input
                className="input w-full"
                type="text"
                placeholder="Full name"
                {...formik.getFieldProps('full_name')}
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.full_name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Phone number</label>
            <div className="flex columns-1 w-full flex-wrap">
              <input
                className="input w-full"
                type="tel"
                placeholder="Phone number"
                {...formik.getFieldProps('phone')}
              />
              {formik.touched.phone && formik.errors.phone && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Source</label>
            <div className="flex columns-1 w-full flex-wrap">
              <Select
                value={formik.values.source}
                onValueChange={(value) => formik.setFieldValue('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  {sourcesData?.result.map((source) => (
                    <SelectItem key={source.id} value={source.code}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.source && formik.errors.source && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.source}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Email</label>
            <div className="flex columns-1 w-full flex-wrap">
              <input
                className="input w-full"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Message</label>
            <div className="flex columns-1 w-full flex-wrap">
              <input
                className="input w-full"
                type="text"
                placeholder="Message"
                {...formik.getFieldProps('message')}
              />
              {formik.touched.message && formik.errors.message && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Client</label>
            <div className="flex columns-1 w-full flex-wrap">
              <input
                className="input w-full"
                type="text"
                placeholder="Client"
                {...formik.getFieldProps('client_id')}
              />
              {formik.touched.client_id && formik.errors.client_id && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.client_id}
                </span>
              )}
            </div>
          </div>

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

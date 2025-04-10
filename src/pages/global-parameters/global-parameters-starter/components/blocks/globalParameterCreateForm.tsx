import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { timeZonesNames } from '@vvo/tzdb';
import { useLanguage } from '@/i18n';
import { localesMock, curreniesMock } from '@/lib/mocks.ts';

interface IGeneralSettingsProps {
  title: string;
}

const createUserSchema = Yup.object().shape({
  company_name: Yup.string().min(1, 'Minimum 3 symbols').required('Name is required'),
  timezone: Yup.string().required('Timezone is required'),
  currency: Yup.string().required('Currency is required'),
  language: Yup.string().required('Language is required')
});

interface IUserFormValues {
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
}

export const GlobalParameterCreateFrom = ({ title }: IGeneralSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { currentLanguage } = useLanguage();

  const initialValues: IUserFormValues = {
    company_name: '',
    timezone: browserTimeZone || '',
    currency: localStorage.getItem('app_currency') || 'USD',
    language: currentLanguage.code
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createUserSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        // const payload = {
        //   ...values,
        //   avatar: values.avatar?.file || null
        // };
        // await postCreateGlobalParameter(payload);
        resetForm();
        setStatus('User created successfully!');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus(error.response?.data?.message || 'Failed to create user');
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  return (
    <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
      <div className="card-header" id="general_settings">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Company Name</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Company Name"
              {...formik.getFieldProps('company_name')}
            />
            {formik.touched.company_name && formik.errors.company_name && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.company_name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Time zone</label>
          <div className="flex columns-1 w-full flex-wrap">
            <Select
              value={formik.values.timezone?.toString()}
              onValueChange={(value) => formik.setFieldValue('timezone', String(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Time Zone" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {timeZonesNames.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.timezone && formik.errors.timezone && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.timezone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Currency</label>
          <div className="flex columns-1 w-full flex-wrap">
            <Select
              value={formik.values.currency?.toString()}
              onValueChange={(value) => formik.setFieldValue('currency', String(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {curreniesMock.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.label} — {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.currency && formik.errors.currency && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.currency}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Language</label>
          <div className="flex columns-1 w-full flex-wrap">
            <Select
              value={formik.values.language?.toString()}
              onValueChange={(value) => formik.setFieldValue('language', String(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {localesMock.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.label} - {language.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.language && formik.errors.language && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.language}
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
  );
};

export { type IGeneralSettingsProps };

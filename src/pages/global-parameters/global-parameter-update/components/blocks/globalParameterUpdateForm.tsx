import { FC, useState } from 'react';
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
import { localesMock, curreniesMock, airlinesMock, timezoneMock } from '@/lib/mocks.ts';
import { putCreateGlobalParameter } from './globalParameterPutApi';
import { ParametersModel } from '@/api/get/getGlobalParameters/types.ts';
import { useParams } from 'react-router';

interface IParameterFormValues {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  airlines: string;
  dimensions_per_place: string;
  cost_per_airplace: number;
}

interface IGeneralSettingsProps {
  title: string;
  parameter: ParametersModel | null;
}

const createParameterSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  timezone: Yup.string().required('Timezone is required'),
  currency: Yup.string().required('Currency is required'),
  language: Yup.string().required('Language is required'),
  legal_address: Yup.string().required('Legal address is required'),
  warehouse_address: Yup.string().required('Warehouse address is required'),
  airlines: Yup.string().required('Airlines is required'),
  dimensions_per_place: Yup.string().required('Dimensions per place is required'),
  cost_per_airplace: Yup.number().required('Cost per airplace is required')
});

export const GlobalParameterUpdateForm: FC<IGeneralSettingsProps> = ({ title, parameter }) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const initialValues: IParameterFormValues = {
    id: Number(id),
    company_name: parameter?.company_name || '',
    timezone: parameter?.timezone || '',
    currency: parameter?.currency || 'USD',
    language: parameter?.language || 'en',
    legal_address: parameter?.legal_address || '',
    warehouse_address: parameter?.warehouse_address || '',
    airlines: parameter?.airlines || '',
    dimensions_per_place: parameter?.dimensions_per_place || '',
    cost_per_airplace: Number(parameter?.cost_per_airplace) || 0
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createParameterSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus(null);
      try {
        await putCreateGlobalParameter(values);
        setStatus('Global Parameters created successfully!');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus(error.response?.data?.message || 'Failed to create global parameters');
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
              value={formik.values.timezone}
              onValueChange={(value) => formik.setFieldValue('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Time Zone" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {timezoneMock.map((tz) => (
                  <SelectItem key={tz.key} value={tz.timezone}>
                    {tz.timezone}
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

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Legal Address</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Legal Address"
              {...formik.getFieldProps('legal_address')}
            />
            {formik.touched.legal_address && formik.errors.legal_address && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.legal_address}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Warehouse Address</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Warehouse Address"
              {...formik.getFieldProps('warehouse_address')}
            />
            {formik.touched.warehouse_address && formik.errors.warehouse_address && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.warehouse_address}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Airlines</label>
          <div className="flex columns-1 w-full flex-wrap">
            <Select
              value={formik.values.airlines?.toString()}
              onValueChange={(value) => formik.setFieldValue('airlines', String(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Airlines" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {airlinesMock.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.label} - {item.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.airlines && formik.errors.airlines && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.airlines}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Dimension Per Place</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Dimension Per Place"
              {...formik.getFieldProps('dimensions_per_place')}
            />
            {formik.touched.dimensions_per_place && formik.errors.dimensions_per_place && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.dimensions_per_place}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Cost Per Airplace</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="number"
              placeholder="Cost Per Airplace"
              {...formik.getFieldProps('cost_per_airplace')}
            />
            {formik.touched.cost_per_airplace && formik.errors.cost_per_airplace && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.cost_per_airplace}
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

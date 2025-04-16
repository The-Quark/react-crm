import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { fieldActivityOptions } from '@/lib/mocks.ts';

const createClientLegalSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  bin: Yup.number().max(12, 'Maximum 12 numbers').required('Company bin is required'),
  fieldActivity: Yup.string().required('Company field of activity is required'),
  legalAddress: Yup.string().required('Company legal address is required'),
  representativeName: Yup.string().required('Company representative name is required'),
  representativeSurname: Yup.string().required('Company representative surname is required'),
  representativePatronymic: Yup.string().required('Company representative patronymic is required'),
  representativePhone: Yup.string().matches(PHONE_REG_EXP, 'Phone number is not valid'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  specialNotes: Yup.string().max(500, 'Maximum 500 symbols')
});

interface IClientLegalFormValues {
  companyName: string;
  bin: string;
  fieldActivity: string;
  legalAddress: string;
  representativeName: string;
  representativeSurname: string;
  representativePatronymic: string;
  representativePhone: string;
  email: string;
  specialNotes: string;
}

const ClientStarterContentLegal = () => {
  const [loading, setLoading] = useState(false);

  const initialValues: IClientLegalFormValues = {
    companyName: '',
    bin: '',
    fieldActivity: '',
    legalAddress: '',
    representativeName: '',
    representativeSurname: '',
    representativePatronymic: '',
    representativePhone: '',
    email: '',
    specialNotes: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createClientLegalSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      console.log('Client Legal: ', values);
      // try {
      //   await postCreateGlobalParameter(values);
      //   resetForm();
      //   setStatus('Global Parameters created successfully!');
      // } catch (err) {
      //   const error = err as AxiosError<{ message?: string }>;
      //   setStatus(error.response?.data?.message || 'Failed to create global parameters');
      // }
      setLoading(false);
      setSubmitting(false);
    }
  });
  return (
    <form className="card-body grid gap-5" onSubmit={formik.handleSubmit} noValidate>
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Company name</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Company name"
            {...formik.getFieldProps('companyName')}
          />
          {formik.touched.companyName && formik.errors.companyName && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.companyName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">BIN</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="number"
            placeholder="BIN"
            {...formik.getFieldProps('bin')}
          />
          {formik.touched.bin && formik.errors.bin && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.bin}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Field of activity</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
            value={formik.values.fieldActivity}
            onValueChange={(value) => formik.setFieldValue('fieldActivity', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field activity" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {fieldActivityOptions.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.fieldActivity && formik.errors.fieldActivity && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.fieldActivity}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Legal address</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Legal address"
            {...formik.getFieldProps('legalAddress')}
          />
          {formik.touched.legalAddress && formik.errors.legalAddress && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.legalAddress}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Representative name</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Name"
            {...formik.getFieldProps('representativeName')}
          />
          {formik.touched.representativeName && formik.errors.representativeName && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.representativeName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Representative surname</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Surname"
            {...formik.getFieldProps('representativeSurname')}
          />
          {formik.touched.representativeSurname && formik.errors.representativeSurname && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.representativeSurname}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Representative patronymic</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Patronymic"
            {...formik.getFieldProps('representativePatronymic')}
          />
          {formik.touched.representativePatronymic && formik.errors.representativePatronymic && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.representativePatronymic}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Representative phone number</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="tel"
            placeholder="Phone number"
            {...formik.getFieldProps('representativePhone')}
          />
          {formik.touched.representativePhone && formik.errors.representativePhone && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.representativePhone}
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
        <label className="form-label max-w-56">Special notes about the client</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Textarea
            className="w-full textarea"
            rows={4}
            placeholder="Special notes"
            {...formik.getFieldProps('specialNotes')}
          />
          {formik.touched.specialNotes && formik.errors.specialNotes && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.specialNotes}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading ? 'Please wait...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentLegal;

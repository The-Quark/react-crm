import React, { FC, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { postClient, putClient } from '@/api';
import { AxiosError } from 'axios';
import { SharedInput, SharedTextArea } from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/api/get/getClients/types.ts';
import { Source } from '@/api/get/getGuides/getSources/types.ts';
import { format } from 'date-fns';

interface Props {
  clientData?: Client;
  sourcesData?: Source[];
}

const validateSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  patronymic: Yup.string().optional(),
  birth_date: Yup.string().optional(),
  gender: Yup.string().required('Gender date is required'),
  email: Yup.string().email('Invalid email address').optional().nullable(),
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Phone number is not valid')
    .required('Phone is required'),
  notes: Yup.string().max(500, 'Maximum 500 symbols').nullable(),
  source_id: Yup.string().required('Source is required')
});

const ClientStarterContentIndividual: FC<Props> = ({ clientData, sourcesData }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues: IClientFormValues = {
    type: 'individual',
    first_name: clientData ? clientData.first_name : '',
    last_name: clientData ? clientData.last_name : '',
    patronymic: clientData ? clientData.patronymic : '',
    birth_date: clientData ? clientData.birth_date : '',
    gender: clientData ? clientData.gender : 'male',
    email: clientData ? clientData.email : '',
    phone: clientData ? clientData.phone : '',
    notes: clientData ? clientData.notes : '',
    source_id: clientData ? clientData.source_id.toString() : ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        const payload = {
          ...values,
          birth_date: values.birth_date
            ? format(new Date(values.birth_date), 'dd.MM.yyyy HH:mm:ss')
            : ''
        };

        if (clientData) {
          await putClient(clientData.id, payload);
        } else {
          await postClient(payload);
        }
        resetForm();
        navigate('/clients');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus(error.response?.data?.message || 'Failed to create client');
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  return (
    <form className="card-body grid gap-5" onSubmit={formik.handleSubmit} noValidate>
      <SharedInput name="first_name" label="First name" formik={formik} />
      <SharedInput name="last_name" label="Last name" formik={formik} />
      <SharedInput name="patronymic" label="Patronymic" formik={formik} />

      <div className="w-full">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label flex- items-center gap-1 max-w-56">Birth Date</label>
          <div className="w-full flex columns-1 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <button id="date" className={cn('input data-[state=open]:border-primary')}>
                  <KeenIcon icon="calendar" className="-ms-0.5" />
                  <span>
                    {formik.values.birth_date
                      ? new Date(formik.values.birth_date).toLocaleDateString()
                      : 'Pick a date'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDate
                  initialFocus
                  mode="single"
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  defaultMonth={new Date(2000, 0)}
                  selected={formik.getFieldProps('birth_date').value}
                  onSelect={(value) => formik.setFieldValue('birth_date', value)}
                />
              </PopoverContent>
            </Popover>
            {formik.touched.birth_date && formik.errors.birth_date && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.birth_date}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Gender</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
            value={formik.values.gender}
            onValueChange={(value) => formik.setFieldValue('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {['male', 'female', 'other'].map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.gender && formik.errors.gender && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.gender}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Source</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
            value={formik.values.source_id}
            onValueChange={(value) => formik.setFieldValue('source_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              {sourcesData?.map((source) => (
                <SelectItem key={source.id} value={source.id.toString()}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.source_id && formik.errors.source_id && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.source_id}
            </span>
          )}
        </div>
      </div>

      <SharedInput name="email" label="Email" formik={formik} type="email" />
      <SharedInput name="phone" label="Phone number" formik={formik} type="tel" />
      <SharedTextArea name="notes" label="Notes" formik={formik} />

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading ? 'Please wait...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentIndividual;

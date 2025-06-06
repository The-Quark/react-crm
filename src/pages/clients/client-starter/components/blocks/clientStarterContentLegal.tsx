import React, { FC, useState } from 'react';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { postClient } from '@/api';
import { AxiosError } from 'axios';
import { SharedInput, SharedTextArea } from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { Client } from '@/api/get/getClients/types.ts';
import { Source } from '@/api/get/getGuides/getSources/types.ts';

interface Props {
  clientData?: Client;
  sourcesData?: Source[];
}

const validateSchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required'),
  bin: Yup.string()
    .length(12, 'BIN must be exactly 12 digits')
    .matches(/^\d+$/, 'BIN must contain only digits')
    .required('Company bin is required'),
  business_type: Yup.string().required('Company field of activity is required'),
  legal_address: Yup.string().required('Company legal address is required'),
  representative_first_name: Yup.string().required('Representative name is required'),
  representative_last_name: Yup.string().required('Representative surname is required'),
  representative_patronymic: Yup.string().required('Representative patronymic is required'),
  representative_phone: Yup.string().matches(PHONE_REG_EXP, 'Phone number is not valid'),
  representative_email: Yup.string().email('Invalid email address').optional(),
  notes: Yup.string().max(500, 'Maximum 500 symbols'),
  source_id: Yup.string().required('Source is required'),
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Phone number is not valid')
    .required('Phone is required'),
  email: Yup.string().email('Invalid email address').optional()
});

const ClientStarterContentLegal: FC<Props> = ({ clientData, sourcesData }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues: IClientFormValues = {
    type: 'legal',
    company_name: clientData?.company_name || '',
    bin: clientData?.bin || '',
    business_type: clientData?.business_type || '',
    legal_address: clientData?.legal_address || '',
    representative_first_name: clientData?.representative_first_name || '',
    representative_last_name: clientData?.representative_last_name || '',
    representative_patronymic: clientData?.representative_patronymic || '',
    representative_phone: clientData?.representative_phone || '',
    representative_email: clientData?.representative_email || '',
    notes: clientData?.notes || '',
    source_id: clientData ? clientData.source_id.toString() : '',
    phone: clientData?.phone || '',
    email: clientData?.email || ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validateSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        await postClient({
          ...values,
          bin: String(values.bin)
        });
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
      <SharedInput name="company_name" label="Company name" formik={formik} />
      <SharedInput name="bin" label="BIN" formik={formik} type="number" maxlength={12} />
      <SharedInput name="phone" label="Phone number" formik={formik} type="tel" />
      <SharedInput name="email" label="Email" formik={formik} type="email" />

      <SharedInput name="business_type" label="Business type" formik={formik} />
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
      <SharedInput name="legal_address" label="Legal address" formik={formik} />
      <SharedInput
        name="representative_first_name"
        label="Representative first name"
        formik={formik}
      />
      <SharedInput
        name="representative_last_name"
        label="Representative last name"
        formik={formik}
      />
      <SharedInput
        name="representative_patronymic"
        label="Representative patronymic"
        formik={formik}
      />
      <SharedInput
        name="representative_phone"
        label="Representative phone number"
        formik={formik}
        type="tel"
      />
      <SharedInput name="representative_email" label="Representative email" formik={formik} />
      <SharedTextArea name="notes" label="Notes" formik={formik} />

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading ? 'Please wait...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentLegal;

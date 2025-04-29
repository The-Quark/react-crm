import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderReceivers, postOrderReceiver, putOrderReceiver } from '@/api';
import { IReceiverOrderFormValues } from '@/api/post/postOrderReceiver/types';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

interface Props {
  onNext: () => void;
  onBack: () => void;
}
const formSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
  city_id: Yup.number().typeError('City is required').required('City is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone is required'),
  street: Yup.string().required('Street is required'),
  house: Yup.string().required('House is required'),
  apartment: Yup.string().required('Apartment is required'),
  location_description: Yup.string().optional(),
  notes: Yup.string().optional(),
  contact_id: Yup.number().optional()
});

export const OrdersReceiverForm: FC<Props> = ({ onBack, onNext }) => {
  const { receiverId } = useParams<{ receiverId?: string }>();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!receiverId;
  const navigate = useNavigate();

  const {
    data: receiverData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['receiver', receiverId],
    queryFn: () => getOrderReceivers(Number(receiverId)),
    enabled: isEditMode
  });

  const initialValues: IReceiverOrderFormValues = {
    full_name: '',
    city_id: 0,
    phone: '',
    street: '',
    house: '',
    apartment: '',
    location_description: '',
    notes: '',
    contact_id: 0
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        if (isEditMode && receiverId) {
          await putOrderReceiver(Number(receiverId), values);
        } else {
          const { result: newReceiverId } = await postOrderReceiver(values);
          navigate(`/${newReceiverId}`);
        }
        onNext();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (receiverData) {
      formik.setValues({
        full_name: receiverData.result[0].full_name,
        city_id: receiverData.result[0].city_id,
        phone: receiverData.result[0].phone,
        street: receiverData.result[0].street,
        house: receiverData.result[0].house,
        apartment: receiverData.result[0].apartment,
        location_description: receiverData.result[0].location_description || '',
        notes: receiverData.result[0].notes || '',
        contact_id: receiverData.result[0].contact_id || 0
      });
    }
  }, [receiverData]);

  const renderField = (name: keyof IReceiverOrderFormValues, label: string, type = 'text') => (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <input
          className="input w-full"
          type={type}
          placeholder={label}
          {...formik.getFieldProps(name)}
        />
        {formik.touched[name] && formik.errors[name] && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors[name] as string}
          </span>
        )}
      </div>
    </div>
  );

  if (isLoading && isEditMode) {
    return <SharedLoading />;
  }

  if (isError && isEditMode) {
    return <SharedError error={error} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode ? 'Edit Order Receiver' : 'New Order Receiver'}
          </h3>
        </div>
        <div className="card-body grid gap-5">
          {renderField('full_name', 'Full name')}
          {renderField('city_id', 'City')}
          {renderField('phone', 'Phone')}
          {renderField('street', 'Street')}
          {renderField('house', 'House')}
          {renderField('apartment', 'Apartment')}
          {renderField('location_description', 'Location description')}
          {renderField('notes', 'Notes')}
          {renderField('contact_id', 'Contact ID', 'number')}

          <div className="flex justify-between">
            <button className="btn btn-primary" onClick={onBack}>
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

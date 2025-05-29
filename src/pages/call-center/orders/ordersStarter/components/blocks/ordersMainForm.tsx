import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedInputTags,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useFormik } from 'formik';
import {
  getApplications,
  getDeliveryTypes,
  getPackageTypes,
  getSources,
  postOrder,
  putOrder
} from '@/api';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/providers';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { useNavigate } from 'react-router';
import { Order } from '@/api/get/getOrder/types.ts';
import { mockOrdersStatus } from '@/lib/mocks.ts';
import { decimalValidation } from '@/utils';

interface Props {
  onBack: () => void;
  onSubmitSuccess?: () => void;
  orderData?: Order;
}

const formSchema = Yup.object().shape({
  application_id: Yup.number().optional(),
  source_id: Yup.string().when('application_id', {
    is: (application_id: number) => !application_id,
    then: (schema) => schema.required('Source is required when application is not selected'),
    otherwise: (schema) => schema.optional()
  }),
  delivery_type: Yup.number()
    .typeError('Delivery type is required')
    .required('Delivery type is required'),
  delivery_category: Yup.string()
    .oneOf(['b2b', 'b2c', 'c2c', 'c2b'], 'Invalid delivery category')
    .required('Delivery category is required'),
  package_type: Yup.number()
    .typeError('Package type is required')
    .required('Package type is required'),
  weight: decimalValidation.required('Weight is required'),
  width: decimalValidation.required('Width is required'),
  length: decimalValidation.required('Length is required'),
  price: Yup.string().optional(),
  places_count: Yup.number().typeError('Places count must be a number').optional(),
  customs_clearance: Yup.boolean().required('Customs clearance is required'),
  is_international: Yup.boolean().required('Is international is required'),
  package_description: Yup.string().optional(),
  special_wishes: Yup.string().optional(),
  order_content: Yup.array().of(Yup.string()).optional()
});

export const OrdersMainForm: FC<Props> = ({ onBack, onSubmitSuccess, orderData }) => {
  const { senderId, receiverId, applicationId, setApplicationId, clearAll } = useOrderCreation();
  const [loading, setLoading] = useState(false);
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: orderData?.id || 0,
      status: orderData?.status || undefined,
      application_id: applicationId || '',
      sender_id: senderId || 0,
      receiver_id: receiverId || 0,
      delivery_type: orderData?.delivery_type.id || '',
      delivery_category: orderData?.delivery_category || 'b2b',
      package_type: orderData?.package_type.id || '',
      weight: orderData?.weight || '',
      width: orderData?.width || '',
      length: orderData?.length || '',
      volume: orderData?.volume || '',
      places_count: orderData?.places_count || 0,
      customs_clearance: orderData?.customs_clearance || false,
      is_international: orderData?.is_international || false,
      price: orderData?.price || '',
      package_description: orderData?.package_description || '',
      special_wishes: orderData?.special_wishes || '',
      source_id: orderData?.source?.id || '',
      order_content: orderData?.order_content || []
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const submitValues = { ...values };
        if (Array.isArray(submitValues.order_content) && submitValues.order_content.length === 0) {
          (submitValues as { order_content?: string[] }).order_content &&
            delete (submitValues as { order_content?: string[] }).order_content;
        }
        const { price, ...finalValues } = submitValues;
        if (orderData) {
          await putOrder(orderData.id, {
            ...finalValues,
            status: values.status as
              | 'package_awaiting'
              | 'buy_for_someone'
              | 'package_received'
              | 'expired',
            delivery_category: values.delivery_category as 'b2b' | 'b2c' | 'c2c' | 'c2b',
            delivery_type: Number(values.delivery_type)
          });
        } else {
          await postOrder({
            ...finalValues,
            delivery_category: values.delivery_category as 'b2b' | 'b2c' | 'c2c' | 'c2b',
            delivery_type: Number(values.delivery_type)
          });
        }
        navigate('/call-center/orders/list');
        resetForm();
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        clearAll();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const errorMessage = error.response?.data?.message || error.message;
        console.error(errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsIsError,
    error: applicationsError
  } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getApplications(),
    staleTime: 1000 * 60 * 5
  });

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
    data: deliveryTypesData,
    isLoading: deliveryTypesLoading,
    isError: deliveryTypesIsError,
    error: deliveryTypesError
  } = useQuery({
    queryKey: ['deliveryTypes'],
    queryFn: () => getDeliveryTypes(),
    staleTime: 1000 * 60 * 5
  });

  const {
    data: packageTypesData,
    isLoading: packageTypesLoading,
    isError: packageTypesIsError,
    error: packageTypesError
  } = useQuery({
    queryKey: ['packageTypes'],
    queryFn: () => getPackageTypes(undefined, currentLanguage.code),
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    const { width, length, weight } = formik.values;
    if (width && length && weight) {
      const volume = Number(width) * Number(length) * Number(weight);
      formik.setFieldValue('volume', volume.toFixed(2));
    } else {
      formik.setFieldValue('volume', '');
    }
  }, [formik.values.width, formik.values.length, formik.values.weight]);

  if (deliveryTypesLoading || packageTypesLoading || applicationsLoading || sourcesLoading) {
    return <SharedLoading />;
  }

  if (deliveryTypesIsError) {
    return <SharedError error={deliveryTypesError} />;
  }
  if (packageTypesIsError) {
    return <SharedError error={packageTypesError} />;
  }
  if (applicationsIsError) {
    return <SharedError error={applicationsError} />;
  }

  if (sourcesIsError) {
    return <SharedError error={sourcesError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">New Order</h3>
        </div>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Application"
            value={formik.values.application_id}
            options={
              applicationsData?.result?.map((app) => ({ id: app.id, name: app.full_name })) ?? []
            }
            placeholder="Select application"
            searchPlaceholder="Search application"
            onChange={(val) => {
              formik.setFieldValue('application_id', val);
              formik.setFieldValue('source_id', '');
              setApplicationId(Number(val));
            }}
            error={formik.errors.application_id as string}
            touched={formik.touched.application_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
          {!formik.values.application_id && (
            <SharedSelect
              name="source_id"
              label="Source"
              formik={formik}
              options={
                sourcesData?.result?.map((source) => ({
                  label: source.name,
                  value: source.id
                })) || []
              }
            />
          )}
          <SharedSelect
            name="delivery_type"
            label="Delivery Type"
            placeholder="Select delivery type"
            formik={formik}
            options={
              deliveryTypesData?.result?.map((type) => ({
                label: type.name,
                value: type.id
              })) || []
            }
          />
          <SharedSelect
            name="delivery_category"
            label="Delivery Category"
            placeholder="Select delivery category"
            formik={formik}
            options={['b2b', 'b2c', 'c2c', 'c2b'].map((category) => ({
              label: category,
              value: category
            }))}
          />
          <div className="flex flex-wrap items-center lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">International</label>
            <div className="flex columns-1 w-full flex-wrap">
              <label className="checkbox-group flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_international"
                  checked={formik.values.is_international}
                  onChange={(e) => formik.setFieldValue('is_international', e.target.checked)}
                  className="checkbox-sm"
                />
                <span className="checkbox-label">Yes</span>
              </label>
              {formik.touched.is_international && formik.errors.is_international && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.is_international}
                </span>
              )}
            </div>
          </div>
          <SharedSelect
            name="package_type"
            label="Package Type"
            placeholder="Select package type"
            formik={formik}
            options={
              packageTypesData?.result[0].language.map((type) => ({
                label: type.name,
                value: type.id
              })) || []
            }
          />
          <SharedInputTags
            value={
              Array.isArray(formik.values.order_content)
                ? formik.values.order_content
                : [formik.values.order_content]
            }
            onChange={(value) =>
              formik.setFieldValue('order_content', value as typeof formik.values.order_content)
            }
            label="Order Content"
            error={formik.errors.order_content as string}
            touched={formik.touched.order_content}
          />
          <SharedInput name="weight" label="Weight (kg)" type="decimal" formik={formik} />
          <SharedInput name="width" label="Width (m)" type="decimal" formik={formik} />
          <SharedInput name="length" label="Length (m)" type="decimal" formik={formik} />
          <SharedInput name="volume" label="Volume" type="number" formik={formik} disabled />
          <SharedInput
            name="places_count"
            label="Places Count"
            type="number"
            formik={formik}
            disabled
          />
          {orderData?.price && (
            <SharedInput name="price" label="Price" formik={formik} type="text" disabled />
          )}
          <div className="flex flex-wrap items-center lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Custom Clearance</label>
            <div className="flex columns-1 w-full flex-wrap">
              <label className="checkbox-group flex items-center gap-2">
                <input
                  type="checkbox"
                  name="customs_clearance"
                  checked={formik.values.customs_clearance}
                  onChange={(e) => formik.setFieldValue('customs_clearance', e.target.checked)}
                  className="checkbox-sm"
                />
                <span className="checkbox-label">Yes</span>
              </label>
              {formik.touched.customs_clearance && formik.errors.customs_clearance && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.customs_clearance}
                </span>
              )}
            </div>
          </div>
          {orderData?.id && (
            <SharedSelect
              name="status"
              label="Status"
              formik={formik}
              options={mockOrdersStatus.map((status) => ({
                label: status.name,
                value: status.value
              }))}
            />
          )}
          <SharedInput name="package_description" label="Package Description" formik={formik} />
          <SharedInput name="special_wishes" label="Special Wishes" formik={formik} />

          <div className="flex justify-between">
            <button className="btn btn-primary" type="button" onClick={onBack}>
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : orderData?.id ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

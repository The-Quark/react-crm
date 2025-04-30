import React, { FC, useState } from 'react';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useFormik } from 'formik';
import { getApplications, getDeliveryTypes, getPackageTypes, postOrder } from '@/api';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/providers';

interface Props {
  onBack: () => void;
}

const twoDecimalPlacesTest = (fieldName: string) =>
  Yup.number()
    .typeError(`${fieldName} must be a number`)
    .test(
      'decimal-places',
      `${fieldName} must have 2 decimal places.`,
      (value) => value === undefined || /^\d+(\.\d{1,2})?$/.test(String(value))
    );

const formSchema = Yup.object().shape({
  application_id: Yup.number()
    .typeError('Application is required')
    .required('Application is required'),
  delivery_type: Yup.number()
    .typeError('Delivery type is required')
    .required('Delivery type is required'),
  delivery_category: Yup.string()
    .oneOf(['b2b', 'b2c', 'c2c', 'c2b'], 'Invalid delivery category')
    .required('Delivery category is required'),
  package_type: Yup.number()
    .typeError('Package type is required')
    .required('Package type is required'),
  weight: Yup.number()
    .required('Weight is required')
    .min(0, 'Weight cannot be negative')
    .test('is-two-decimal', 'The weight field must have exactly 2 decimal places.', (value) => {
      if (value === undefined || value === null) return false;
      const decimalPart = value.toString().split('.')[1];
      return decimalPart?.length === 2;
    }),
  width: Yup.number()
    .required('Width is required')
    .min(0, 'Width cannot be negative')
    .test('is-two-decimal', 'The width field must have exactly 2 decimal places.', (value) => {
      if (value === undefined || value === null) return false;
      const decimalPart = value.toString().split('.')[1];
      return decimalPart?.length === 2;
    }),
  length: Yup.number()
    .required('Length is required')
    .min(0, 'Length cannot be negative')
    .test('is-two-decimal', 'The length field must have exactly 2 decimal places.', (value) => {
      if (value === undefined || value === null) return false;
      const decimalPart = value.toString().split('.')[1];
      return decimalPart?.length === 2;
    }),
  volume: twoDecimalPlacesTest('Volume').optional(),
  price: twoDecimalPlacesTest('Price').optional(),
  places_count: Yup.number().typeError('Places count must be a number').optional(),
  customs_clearance: Yup.boolean().required('Customs clearance is required'),
  is_international: Yup.boolean().required('Is international is required'),
  package_description: Yup.string().optional(),
  special_wishes: Yup.string().optional()
});

export const OrdersMainForm: FC<Props> = ({ onBack }) => {
  const { receiverId } = useParams<{ receiverId?: string }>();
  const { senderId } = useParams<{ senderId?: string }>();
  const [loading, setLoading] = useState(false);
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const formik = useFormik({
    initialValues: {
      application_id: '',
      sender_id: senderId ? Number(senderId) : 0,
      receiver_id: receiverId ? Number(receiverId) : 0,
      delivery_type: '',
      delivery_category: 'b2b',
      package_type: '',
      weight: '',
      width: '',
      length: '',
      volume: '',
      places_count: 0,
      customs_clearance: false,
      is_international: false,
      price: 0,
      package_description: '',
      special_wishes: ''
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        await postOrder({
          ...values,
          delivery_category: values.delivery_category as 'b2b' | 'b2c' | 'c2c' | 'c2b'
        });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
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
    queryFn: () => getApplications()
  });

  const {
    data: deliveryTypesData,
    isLoading: deliveryTypesLoading,
    isError: deliveryTypesIsError,
    error: deliveryTypesError
  } = useQuery({
    queryKey: ['deliveryTypes'],
    queryFn: () => getDeliveryTypes()
  });

  const {
    data: packageTypesData,
    isLoading: packageTypesLoading,
    isError: packageTypesIsError,
    error: packageTypesError
  } = useQuery({
    queryKey: ['packageTypes'],
    queryFn: () => getPackageTypes(undefined, currentLanguage.code)
  });

  if (deliveryTypesLoading || packageTypesLoading || applicationsLoading) {
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
            }}
            error={formik.errors.application_id as string}
            touched={formik.touched.application_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
          <SharedSelect
            name="delivery_type"
            label="Delivery type"
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
          <SharedInput name="weight" label="Weight" type="number" formik={formik} />
          <SharedInput name="width" label="Width" type="number" formik={formik} />
          <SharedInput name="length" label="Length" type="number" formik={formik} />
          <SharedInput name="volume" label="Volume" type="number" formik={formik} />
          <SharedInput name="places_count" label="Places Count" type="number" formik={formik} />
          <SharedInput name="price" label="Price" formik={formik} type="number" />
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
              {loading ? 'Please wait...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

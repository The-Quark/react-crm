import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  SharedAutocomplete,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedInputTags,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useFormik } from 'formik';
import {
  getApplications,
  getDeliveryTypes,
  getPackageTypes,
  getSources,
  postOrderCalculate
} from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/providers';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { mockOrdersStatus } from '@/lib/mocks.ts';
import { decimalValidation } from '@/utils';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { IPostCalculateFormFields } from '@/api/post/postWorkflow/postOrderCalculate/types';

interface Props {
  orderData?: Order;
  onNext: () => void;
  orderId: string;
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
  height: decimalValidation.required('Height is required'),
  customs_clearance: Yup.boolean().required('Customs clearance is required'),
  is_international: Yup.boolean().required('Is international is required'),
  package_description: Yup.string().optional(),
  special_wishes: Yup.string().optional(),
  order_content: Yup.array().of(Yup.string()).optional()
});

const getInitialValues = (
  isEditMode: boolean,
  orderData: Order,
  applicationId: string | number
): IOrderFormValues => {
  if (isEditMode && orderData) {
    return {
      id: orderData.id || 0,
      application_id: orderData?.application_id || applicationId || '',
      status: orderData?.status || undefined,
      delivery_type: orderData?.delivery_type?.id || '',
      delivery_category: orderData?.delivery_category || 'b2b',
      package_type: orderData?.package_type?.id || '',
      weight: orderData?.weight || '',
      width: orderData?.width || '',
      length: orderData?.length || '',
      height: orderData?.height || '',
      volume: orderData?.volume || '',
      places_count: orderData?.places_count || 0,
      customs_clearance: orderData?.customs_clearance || false,
      is_international: orderData?.is_international || false,
      price: orderData?.price || '',
      package_description: orderData?.package_description || '',
      special_wishes: orderData?.special_wishes || '',
      source_id: orderData?.source?.id || '',
      order_content: orderData?.order_content || []
    };
  }

  return {
    id: 0,
    application_id: '',
    status: undefined,
    delivery_type: '',
    delivery_category: 'b2b',
    package_type: '',
    weight: '',
    width: '',
    length: '',
    height: '',
    volume: '',
    places_count: 0,
    customs_clearance: false,
    is_international: false,
    price: '',
    package_description: '',
    special_wishes: '',
    source_id: '',
    order_content: orderData?.order_content || []
  };
};

export const OrdersMainForm: FC<Props> = ({ orderData, onNext, orderId }) => {
  const { setMainFormData, setApplicationId, applicationId } = useOrderCreation();
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const isEditMode = !!orderId;

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, orderData as Order, applicationId || ''),
    validationSchema: formSchema,
    onSubmit: (values) => {
      setMainFormData(values as IOrderFormValues);
      onNext();
    }
  });

  useEffect(() => {
    const { weight, width, length, height } = formik.values;

    if (weight && width && length && height) {
      const calculateData: IPostCalculateFormFields = {
        weight,
        width,
        length,
        height
      };

      postOrderCalculate(calculateData)
        .then((response) => {
          formik.setFieldValue('volume', response.volume);
          formik.setFieldValue('places_count', response.places_count);
          formik.setFieldValue('price', response.price);
        })
        .catch((error) => {
          console.error('Error calculating order:', error);
        });
    }
  }, [formik.values.weight, formik.values.width, formik.values.length, formik.values.height]);

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsIsError,
    error: applicationsError
  } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getApplications({}),
    staleTime: 1000 * 60 * 5
  });

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources({}),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: deliveryTypesData,
    isLoading: deliveryTypesLoading,
    isError: deliveryTypesIsError,
    error: deliveryTypesError
  } = useQuery({
    queryKey: ['deliveryTypes'],
    queryFn: () => getDeliveryTypes({}),
    staleTime: 1000 * 60 * 5
  });

  const {
    data: packageTypesData,
    isLoading: packageTypesLoading,
    isError: packageTypesIsError,
    error: packageTypesError
  } = useQuery({
    queryKey: ['packageTypes'],
    queryFn: () =>
      getPackageTypes({
        language_code: currentLanguage.code
      }),
    staleTime: 1000 * 60 * 5
  });

  const isFormLoading =
    deliveryTypesLoading || packageTypesLoading || applicationsLoading || sourcesLoading;
  const isFormError =
    deliveryTypesIsError || packageTypesIsError || applicationsIsError || sourcesIsError;
  const formErrors = [
    deliveryTypesError,
    packageTypesError,
    applicationsError,
    sourcesError
  ].filter((error) => error !== null);

  if (isFormLoading) {
    return <SharedLoading simple />;
  }

  if (isFormError) {
    return (
      <div>
        {formErrors.map((error, index) => (
          <SharedError key={index} error={error} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Application"
            value={formik.values.application_id ?? ''}
            options={
              (applicationsData?.result?.map((app) => ({
                id: app.id,
                name:
                  app.client_type === 'legal'
                    ? app.company_name || ''
                    : `${app.first_name} ${app.last_name} ${app.patronymic || ''}`.trim() || ''
              })) as { id: number; name: string }[]) ?? []
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
              Array.isArray(formik.values?.order_content)
                ? (formik.values?.order_content.filter(
                    (v): v is string => typeof v === 'string'
                  ) as string[])
                : typeof formik.values?.order_content === 'string'
                  ? [formik.values.order_content]
                  : []
            }
            onChange={(value) =>
              formik.setFieldValue('order_content', value as typeof formik.values.order_content)
            }
            label="Order Content"
            error={formik.errors.order_content as string}
            touched={formik.touched.order_content}
          />
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
          <SharedDecimalInput name="weight" label="Weight (kg)" formik={formik} />
          <SharedDecimalInput name="width" label="Width (m)" formik={formik} />
          <SharedDecimalInput name="length" label="Length (m)" formik={formik} />
          <SharedDecimalInput name="height" label="Height (m)" formik={formik} />
          <SharedInput name="volume" label="Volume" type="number" formik={formik} disabled />
          <SharedInput
            name="places_count"
            label="Places Count"
            type="number"
            formik={formik}
            disabled
          />
          <SharedInput name="price" label="Price" formik={formik} type="text" disabled />
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
          <SharedTextArea name="package_description" label="Package Description" formik={formik} />
          <SharedTextArea name="special_wishes" label="Special Wishes" formik={formik} />

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {orderData?.id ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

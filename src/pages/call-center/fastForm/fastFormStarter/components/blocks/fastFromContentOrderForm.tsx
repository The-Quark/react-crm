import React, { FC, useEffect } from 'react';
import * as Yup from 'yup';
import {
  SharedCheckBox,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedInputTags,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useFormik } from 'formik';
import { getDeliveryTypes, getPackageTypes, postOrderCalculate } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useCurrency, useLanguage } from '@/providers';
import { cleanValues, decimalValidation, mockDeliveryCategories } from '@/utils';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { IPostCalculateFormFields } from '@/api/post/postWorkflow/postOrderCalculate/types';
import { useFastFormContext } from '@/pages/call-center/fastForm/fastFormStarter/components/context/fastFormContext.tsx';
import { DeliveryCategories } from '@/api/enums';
import { useIntl } from 'react-intl';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const formSchema = Yup.object().shape({
  delivery_type: Yup.number()
    .typeError('VALIDATION.DELIVERY_TYPE_REQUIRED')
    .required('VALIDATION.DELIVERY_TYPE_TYPE_ERROR'),
  delivery_category: Yup.string()
    .oneOf(
      [
        DeliveryCategories.B2B,
        DeliveryCategories.B2C,
        DeliveryCategories.C2C,
        DeliveryCategories.C2B
      ],
      'VALIDATION.DELIVERY_CATEGORY_INVALID'
    )
    .required('VALIDATION.DELIVERY_CATEGORY_REQUIRED'),
  package_type: Yup.number()
    .typeError('VALIDATION.PACKAGE_TYPE_TYPE_ERROR')
    .required('VALIDATION.PACKAGE_TYPE_REQUIRED'),
  weight: decimalValidation.required('VALIDATION.WEIGHT_REQUIRED'),
  width: decimalValidation.required('VALIDATION.WIDTH_REQUIRED'),
  length: decimalValidation.required('VALIDATION.LENGTH_REQUIRED'),
  height: decimalValidation.required('VALIDATION.HEIGHT_REQUIRED'),
  customs_clearance: Yup.boolean().required('VALIDATION.CLEARANCE_REQUIRED'),
  nominal_cost: Yup.string().when('customs_clearance', {
    is: true,
    then: (schema) => schema.required('VALIDATION.NOMINAL_COST_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  is_international: Yup.boolean().required('VALIDATION.IS_INTERNATIONAL_REQUIRED'),
  package_description: Yup.string().optional(),
  special_wishes: Yup.string().optional(),
  order_content: Yup.array().of(Yup.string()).optional()
});

const getInitialValues = (orderData: IOrderFormValues): IOrderFormValues => {
  if (orderData) {
    return {
      delivery_type: orderData?.delivery_type || '',
      delivery_category: orderData?.delivery_category || DeliveryCategories.B2B,
      package_type: orderData?.package_type || '',
      is_express: orderData?.is_express || false,
      nominal_cost: orderData?.nominal_cost || '',
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
      order_content: orderData?.order_content || []
    };
  }

  return {
    delivery_type: '',
    delivery_category: DeliveryCategories.B2B,
    package_type: '',
    is_express: false,
    weight: '',
    width: '',
    length: '',
    height: '',
    volume: '',
    nominal_cost: '',
    places_count: 0,
    customs_clearance: false,
    is_international: false,
    price: '',
    package_description: '',
    special_wishes: '',
    source_id: '',
    order_content: []
  };
};

export const FastFormContentOrderForm: FC<Props> = ({ onNext, onBack }) => {
  const { mainForm, setMainForm, setModalInfoData, modalInfo } = useFastFormContext();
  const { formatMessage } = useIntl();
  const { currentLanguage } = useLanguage();
  const { currency: currentCurrency } = useCurrency();

  const formik = useFormik({
    initialValues: getInitialValues(mainForm?.order as IOrderFormValues),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const cleanData = cleanValues(values);
      setMainForm({
        ...mainForm,
        order: {
          ...(cleanData as IOrderFormValues)
        }
      });
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
        height,
        nominal_cost: formik.values.nominal_cost ?? '',
        is_express: formik.values.is_express ?? false
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
  }, [
    formik.values.weight,
    formik.values.width,
    formik.values.length,
    formik.values.height,
    formik.values.is_express,
    formik.values.nominal_cost
  ]);

  const {
    data: deliveryTypesData,
    isLoading: deliveryTypesLoading,
    isError: deliveryTypesIsError,
    error: deliveryTypesError
  } = useQuery({
    queryKey: ['fastFormDeliveryTypes'],
    queryFn: () => getDeliveryTypes({})
  });

  const {
    data: packageTypesData,
    isLoading: packageTypesLoading,
    isError: packageTypesIsError,
    error: packageTypesError
  } = useQuery({
    queryKey: ['fastFormPackageTypes'],
    queryFn: () =>
      getPackageTypes({
        language_code: currentLanguage.code,
        is_active: true
      })
  });

  const isFormLoading = deliveryTypesLoading || packageTypesLoading;
  const isFormError = deliveryTypesIsError || packageTypesIsError;
  const formErrors = [deliveryTypesError, packageTypesError].filter((error) => error !== null);

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
          <SharedSelect
            name="delivery_type"
            label={formatMessage({ id: 'SYSTEM.DELIVERY_TYPE' })}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT' })}
            formik={formik}
            options={
              deliveryTypesData?.result?.map((type) => ({
                label: type.name,
                value: type.id
              })) || []
            }
            onChange={(value) => {
              formik.setFieldValue('delivery_type', value);
              const selectedType = deliveryTypesData?.result?.find((type) => type.id === value);
              setModalInfoData({
                ...modalInfo,
                delivery_type_name: selectedType?.name ?? ''
              });
            }}
          />
          <SharedSelect
            name="delivery_category"
            label={formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_CATEGORY' })}
            formik={formik}
            options={mockDeliveryCategories.map((category) => ({
              label: formatMessage({ id: category.name }),
              value: category.value
            }))}
          />
          <SharedCheckBox
            name="is_international"
            label={formatMessage({ id: 'SYSTEM.INTERNATIONAL' })}
            formik={formik}
          />
          <SharedSelect
            name="package_type"
            label={formatMessage({ id: 'SYSTEM.PACKAGE_TYPE' })}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT' })}
            formik={formik}
            options={
              packageTypesData?.result.map((packageType) => ({
                label: packageType.language[0]?.name || packageType.code,
                value: packageType.id
              })) || []
            }
            onChange={(value) => {
              formik.setFieldValue('package_type', value);
              const selectedType = packageTypesData?.result?.find((type) => type.id === value);
              setModalInfoData({
                ...modalInfo,
                package_type_name: selectedType?.language[0]?.name || selectedType?.code || ''
              });
            }}
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
            label={formatMessage({ id: 'SYSTEM.ORDER_CONTENT' })}
            error={formik.errors.order_content as string}
            touched={formik.touched.order_content}
          />
          <SharedCheckBox
            name="customs_clearance"
            label={formatMessage({ id: 'SYSTEM.CUSTOMS_CLEARANCE' })}
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue('customs_clearance', e.target.checked);
              if (!e.target.checked) {
                formik.setFieldValue('nominal_cost', '');
              }
            }}
          />
          <SharedCheckBox
            name="is_express"
            label={formatMessage({ id: 'SYSTEM.IS_EXPRESS' })}
            formik={formik}
          />
          {formik.values.customs_clearance && (
            <SharedDecimalInput
              name="nominal_cost"
              label={`${formatMessage({ id: 'SYSTEM.NOMINAL_COST' })} (USD)`}
              formik={formik}
            />
          )}
          <SharedDecimalInput
            name="weight"
            label={`${formatMessage({ id: 'SYSTEM.WEIGHT' })} (kg)`}
            formik={formik}
          />
          <SharedDecimalInput
            name="width"
            label={`${formatMessage({ id: 'SYSTEM.WIDTH' })} (cm)`}
            formik={formik}
          />
          <SharedDecimalInput
            name="length"
            label={`${formatMessage({ id: 'SYSTEM.LENGTH' })} (cm)`}
            formik={formik}
          />
          <SharedDecimalInput
            name="height"
            label={`${formatMessage({ id: 'SYSTEM.HEIGHT' })} (cm)`}
            formik={formik}
          />
          <SharedInput
            name="volume"
            label={`${formatMessage({ id: 'SYSTEM.VOLUME' })} (см³)`}
            type="number"
            formik={formik}
            disabled
          />
          <SharedInput
            name="places_count"
            label={formatMessage({ id: 'SYSTEM.PLACES_COUNT' })}
            type="number"
            formik={formik}
            disabled
          />
          <SharedInput
            name="price"
            label={`${formatMessage({ id: 'SYSTEM.PRICE' })} (${currentCurrency.code})`}
            formik={formik}
            type="text"
            disabled
          />
          <SharedTextArea
            name="package_description"
            label={formatMessage({ id: 'SYSTEM.PACKAGE_DESCRIPTION' })}
            formik={formik}
          />
          <SharedTextArea
            name="special_wishes"
            label={formatMessage({ id: 'SYSTEM.SPECIAL_WISHES' })}
            formik={formik}
          />

          <div className="flex justify-between">
            <button className="btn btn-light" onClick={onBack}>
              {formatMessage({ id: 'SYSTEM.BACK' })}
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formatMessage({ id: 'SYSTEM.NEXT' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

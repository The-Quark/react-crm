import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  SharedAutocomplete,
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
import { getApplications, getDeliveryTypes, getPackageTypes, postOrderCalculate } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useCurrency, useLanguage } from '@/providers';
import { useOrderCreation } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { mockDeliveryCategories, mockOrdersStatus } from '@/utils/enumsOptions/mocks.ts';
import { decimalValidation, DEFAULT_SEARCH_PAGE_NUMBER } from '@/utils';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { IPostCalculateFormFields } from '@/api/post/postWorkflow/postOrderCalculate/types';
import { ApplicationsStatus, ClientType, DeliveryCategories } from '@/api/enums';
import { useIntl } from 'react-intl';
import { DeliveryType } from '@/api/get/getGuides/getDeliveryTypes/types.ts';
import { PackageType } from '@/api/get/getGuides/getPackageTypes/types.ts';

interface Props {
  onNext: () => void;
  isEditMode: boolean;
}

const formSchema = Yup.object().shape({
  application_id: Yup.number().required('VALIDATION.APPLICATION_ID_REQUIRED'),
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

const getInitialValues = (
  applicationId: string | number,
  mainForm: IOrderFormValues | null,
  deliveryTypesData?: DeliveryType[],
  packageTypesData?: PackageType[]
): IOrderFormValues => {
  if (mainForm) {
    const deliveryTypeName =
      mainForm.delivery_type_name ||
      deliveryTypesData?.find((t) => t.id === mainForm.delivery_type)?.name ||
      '';
    const packageTypeName =
      mainForm.package_type_name ||
      packageTypesData?.find((t) => t.id === mainForm.package_type)?.language[0]?.name ||
      packageTypesData?.find((t) => t.id === mainForm.package_type)?.code ||
      '';
    return {
      id: 0,
      application_id: mainForm.application_id || applicationId || '',
      status: undefined,
      delivery_type: mainForm.delivery_type || '',
      delivery_type_name: deliveryTypeName,
      delivery_category: mainForm.delivery_category || DeliveryCategories.B2B,
      package_type: mainForm.package_type || '',
      package_type_name: packageTypeName,
      is_express: mainForm.is_express || false,
      nominal_cost: mainForm.nominal_cost || '',
      weight: mainForm.weight || '',
      width: mainForm.width || '',
      length: mainForm.length || '',
      height: mainForm.height || '',
      volume: mainForm.volume || '',
      places_count: mainForm.places_count || 0,
      customs_clearance: mainForm.customs_clearance || false,
      is_international: mainForm.is_international || false,
      price: mainForm.price || '',
      package_description: mainForm.package_description || '',
      special_wishes: mainForm.special_wishes || '',
      order_content: mainForm.order_content || [],
      sender_contact_id: mainForm.sender_contact_id || '',
      sender_type: mainForm.sender_type || ClientType.INDIVIDUAL
    };
  }
  return {
    id: 0,
    application_id: applicationId || '',
    status: undefined,
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
    order_content: [],
    sender_contact_id: '',
    sender_type: ClientType.INDIVIDUAL
  };
};

export const OrdersMainForm: FC<Props> = ({ onNext, isEditMode }) => {
  const { setMainFormData, applicationId, mainFormData, initialData } = useOrderCreation();
  const { formatMessage } = useIntl();
  const { currentLanguage } = useLanguage();
  const { currency } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsIsError,
    error: applicationsError
  } = useQuery({
    queryKey: ['applications', searchTerm],
    queryFn: () =>
      getApplications({
        status: ApplicationsStatus.NEW,
        per_page: DEFAULT_SEARCH_PAGE_NUMBER,
        full_name: searchTerm
      })
  });

  const {
    data: deliveryTypesData,
    isLoading: deliveryTypesLoading,
    isError: deliveryTypesIsError,
    error: deliveryTypesError
  } = useQuery({
    queryKey: ['deliveryTypes'],
    queryFn: () => getDeliveryTypes({})
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
        language_code: currentLanguage.code,
        is_active: true
      })
  });

  const formik = useFormik({
    initialValues: getInitialValues(
      applicationId || '',
      mainFormData,
      deliveryTypesData?.result,
      packageTypesData?.result
    ),
    validationSchema: formSchema,
    onSubmit: (values) => {
      setMainFormData({ ...mainFormData, ...values });
      onNext();
    },
    enableReinitialize: true
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

  useEffect(() => {
    if (formik.values.application_id) {
      const selectedApp = applicationsData?.result?.find(
        (app) => app.id === formik.values.application_id
      );
      if (selectedApp) {
        formik.setFieldValue(
          'sender_contact_id',
          selectedApp.client_id || mainFormData?.sender_contact_id
        );
        formik.setFieldValue('weight', selectedApp.weight || mainFormData?.weight || '');
        formik.setFieldValue('width', selectedApp.width || mainFormData?.width || '');
        formik.setFieldValue('length', selectedApp.length || mainFormData?.length || '');
        formik.setFieldValue('height', selectedApp.height || mainFormData?.height || '');
        formik.setFieldValue(
          'application_full_name',
          selectedApp.full_name || mainFormData?.application_full_name || ''
        );
      }
    }
  }, [applicationsData?.result, formik.values.application_id]);

  const isFormLoading = deliveryTypesLoading || packageTypesLoading;
  const isFormError = deliveryTypesIsError || packageTypesIsError || applicationsIsError;
  const formErrors = [deliveryTypesError, packageTypesError, applicationsError].filter(
    (error) => error !== null
  );

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
          {isEditMode ? (
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 ">
              <label className="form-label max-w-56">
                {formatMessage({ id: 'SYSTEM.APPLICATION' })}
              </label>
              <div className="flex columns-1 w-full flex-wrap">
                <input
                  className="input w-full"
                  value={initialData?.application?.full_name}
                  disabled={true}
                />
              </div>
            </div>
          ) : (
            <SharedAutocomplete
              label={formatMessage({ id: 'SYSTEM.APPLICATION' })}
              value={formik.values.application_id ?? ''}
              options={
                (applicationsData?.result?.map((app) => ({
                  id: app.id,
                  name: app.full_name
                })) as { id: number; name: string }[]) ?? []
              }
              placeholder={formatMessage({ id: 'SYSTEM.SELECT' })}
              searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_APPLICATION' })}
              onChange={(val) => {
                const selectedApp = applicationsData?.result?.find((app) => app.id === val);
                formik.setFieldValue('application_id', val);
                formik.setFieldValue('sender_contact_id', selectedApp?.client_id || '');
                formik.setFieldValue('application_full_name', selectedApp?.full_name || '');
              }}
              error={formik.errors.application_id as string}
              touched={formik.touched.application_id}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              loading={applicationsLoading}
            />
          )}
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
              formik.setFieldValue('delivery_type_name', selectedType?.name || '');
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
              formik.setFieldValue(
                'package_type_name',
                selectedType?.language[0]?.name || selectedType?.code || ''
              );
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
            label={`${formatMessage({ id: 'SYSTEM.PRICE' })} (${currency.code})`}
            formik={formik}
            type="text"
            disabled
          />
          {isEditMode && (
            <SharedSelect
              name="status"
              label={formatMessage({ id: 'SYSTEM.STATUS' })}
              formik={formik}
              options={mockOrdersStatus.map((status) => ({
                label: status.name,
                value: status.value
              }))}
            />
          )}
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
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formatMessage({ id: 'SYSTEM.NEXT' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

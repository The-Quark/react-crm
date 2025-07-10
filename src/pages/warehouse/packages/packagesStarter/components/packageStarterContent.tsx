import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getOrders,
  putPackage,
  postPackage,
  postOrderCalculate,
  putOrderStatus,
  getBoxTypes
} from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedSelect
} from '@/partials/sharedUI';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';
import { OrderStatus, PackageStatus } from '@/api/enums';
import { packageStatusOptions } from '@/utils/enumsOptions/mocks.ts';
import { decimalValidation, DEFAULT_SEARCH_PAGE_NUMBER } from '@/utils';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';
import { useIntl } from 'react-intl';
import { Divider } from '@mui/material';
import { useCurrency } from '@/providers';

interface Props {
  isEditMode: boolean;
  packageData?: Package;
  packageId?: number;
}

export const formSchema = Yup.object().shape({
  order_id: Yup.string().required('VALIDATION.ORDER_ID_REQUIRED'),
  weight: decimalValidation.required('VALIDATION.WEIGHT_REQUIRED'),
  width: decimalValidation.required('VALIDATION.WIDTH_REQUIRED'),
  length: decimalValidation.required('VALIDATION.LENGTH_REQUIRED'),
  height: decimalValidation.required('VALIDATION.HEIGHT_REQUIRED'),
  box_type_id: Yup.string().test(
    'box-type-or-dimensions',
    'VALIDATION.TYPE_REQUIRED',
    function (value) {
      const { box_width, box_height, box_length } = this.parent;
      return !!value || (!!box_width && !!box_height && !!box_length);
    }
  ),
  box_width: Yup.string().when('box_type_id', {
    is: (val: string) => !val,
    then: (schema) => schema.required('VALIDATION.WIDTH_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  box_length: Yup.string().when('box_type_id', {
    is: (val: string) => !val,
    then: (schema) => schema.required('VALIDATION.LENGTH_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  box_height: Yup.string().when('box_type_id', {
    is: (val: string) => !val,
    then: (schema) => schema.required('VALIDATION.HEIGHT_REQUIRED'),
    otherwise: (schema) => schema.optional()
  }),
  status: Yup.string().optional()
});

const getInitialValues = (
  isEditMode: boolean,
  packageData: Package,
  orderUrlId: number | null
): IPackageFormValues => {
  if (isEditMode && packageData) {
    return {
      order_id: packageData.order_id?.toString() ?? '',
      weight: packageData?.weight?.toString() ?? '',
      width: packageData?.width?.toString() ?? '',
      length: packageData?.length?.toString() ?? '',
      height: packageData?.height?.toString() ?? '',
      volume: packageData?.volume ?? '',
      places_count: packageData?.places_count ?? '',
      price: packageData?.price ?? '',
      box_type_id: packageData?.box_type_id?.toString() ?? '',
      box_width: packageData?.box_width?.toString() ?? '',
      box_length: packageData?.box_length?.toString() ?? '',
      box_height: packageData?.box_height?.toString() ?? '',
      status: packageData.status as unknown as PackageStatus
    };
  }
  return {
    order_id: orderUrlId || '',
    weight: '',
    width: '',
    length: '',
    height: '',
    volume: '',
    box_type_id: '',
    box_width: '',
    box_length: '',
    box_height: '',
    places_count: '',
    price: '',
    status: ''
  };
};

export const PackageStarterContent = ({ isEditMode, packageId, packageData }: Props) => {
  const [searchParams] = useSearchParams();
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currency: currentCurrency } = useCurrency();

  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const [searchBoxTypeTerm, setSearchBoxTypeTerm] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const orderIdFromUrl = useMemo(() => {
    const id = searchParams.get('order_id');
    return id ? Number(id) : null;
  }, [searchParams]);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersIsError,
    error: ordersError
  } = useQuery({
    queryKey: ['packageOrders', searchOrderTerm],
    queryFn: () =>
      getOrders({
        per_page: DEFAULT_SEARCH_PAGE_NUMBER,
        searchorder: searchOrderTerm,
        ...(isEditMode ? {} : { status: 'package_awaiting' })
      })
  });

  const {
    data: boxTypesData,
    isLoading: boxTypesLoading,
    isError: boxTypesIsError,
    error: boxTypesError
  } = useQuery({
    queryKey: ['cargoBoxTypes'],
    queryFn: () => getBoxTypes({})
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, packageData || ({} as Package), orderIdFromUrl),
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitLoading(true);
      try {
        if (isEditMode && packageId) {
          const { status, ...putData } = values;
          await putPackage(Number(packageId), {
            id: Number(packageId),
            ...putData,
            status: status as PackageStatus,
            order_id: Number(putData.order_id)
          });
        } else {
          await postPackage(values);
        }
        queryClient.invalidateQueries({ queryKey: ['packages'] });
        navigate('/warehouse/packages/list');
        resetForm();
        setSearchOrderTerm('');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setSubmitLoading(false);
        setSubmitting(false);
      }
    }
  });

  const handleBoxTypeChange = useCallback(
    (boxTypeId: string | number) => {
      if (boxTypeId === '' || boxTypeId === '__clear__') {
        formik.setValues({
          ...formik.values,
          box_type_id: '',
          box_width: '',
          box_height: '',
          box_length: ''
        });
        return;
      }
      const id = typeof boxTypeId === 'number' ? boxTypeId.toString() : boxTypeId;
      const selectedBoxType = boxTypesData?.result?.find((box) => box.id === Number(id));
      if (selectedBoxType) {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          box_width: selectedBoxType.width?.toString() ?? '',
          box_height: selectedBoxType.height?.toString() ?? '',
          box_length: selectedBoxType.length?.toString() ?? ''
        });
      } else {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          box_width: '',
          box_height: '',
          box_length: ''
        });
      }
    },
    [formik, boxTypesData?.result]
  );

  const handleOrderChange = useCallback(
    (orderId: string | number) => {
      const id = typeof orderId === 'number' ? orderId.toString() : orderId;
      formik.setFieldValue('order_id', id);

      const selectedOrder = ordersData?.result?.find((order) => order.id === Number(id));
      if (selectedOrder) {
        formik.setValues({
          ...formik.values,
          order_id: id,
          weight: selectedOrder.weight?.toString() ?? '',
          width: selectedOrder.width?.toString() ?? '',
          length: selectedOrder.length?.toString() ?? '',
          height: selectedOrder.height?.toString() ?? '',
          volume: selectedOrder.volume?.toString() ?? '',
          places_count: selectedOrder.places_count?.toString() ?? '',
          price: selectedOrder.price?.toString() ?? '',
          box_type_id: selectedOrder.application?.box_type_id?.toString() ?? '',
          box_width: selectedOrder.application?.box_width?.toString() ?? '',
          box_length: selectedOrder.application?.box_length?.toString() ?? '',
          box_height: selectedOrder.application?.box_height?.toString() ?? ''
        });
      }
    },
    [formik, ordersData?.result]
  );

  useEffect(() => {
    if (!isEditMode && orderIdFromUrl && ordersData?.result?.length) {
      const selectedOrder = ordersData.result.find((order) => order.id === orderIdFromUrl);
      if (selectedOrder) {
        handleOrderChange(orderIdFromUrl);
      }
    }
  }, [isEditMode, orderIdFromUrl, ordersData?.result]);

  useEffect(() => {
    const calculateVolume = async () => {
      const { weight, width, length, height } = formik.values;
      if (weight && width && length && height) {
        try {
          const response = await postOrderCalculate({
            weight,
            width,
            length,
            height
          });
          formik.setFieldValue('volume', response.volume);
          formik.setFieldValue('places_count', response.places_count);
          formik.setFieldValue('price', response.price);
        } catch (error) {
          console.error('Error calculating order:', error);
        }
      }
    };

    calculateVolume();
  }, [formik.values.weight, formik.values.width, formik.values.length, formik.values.height]);

  const handleCancel = useCallback(async () => {
    if (!formik.values.order_id) return;

    try {
      setCancelLoading(true);
      await putOrderStatus({
        id: Number(formik.values.order_id),
        status: OrderStatus.CANCELLED_BY_SYSTEM
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/call-center/orders/list');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error(error.response?.data?.message || error.message);
    } finally {
      setCancelLoading(false);
    }
  }, [formik.values.order_id, navigate, queryClient]);

  if (ordersIsError || boxTypesIsError) {
    return <SharedError error={ordersError || boxTypesError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode
              ? formatMessage({ id: 'SYSTEM.EDIT_PACKAGE' })
              : formatMessage({ id: 'SYSTEM.NEW_PACKAGE' })}
          </h3>
        </div>
        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.ORDER' })}
            value={formik.values.order_id ?? ''}
            options={
              ordersData?.result?.map((app) => ({
                id: app.id,
                name: String(app.order_code || app.id)
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_ORDER' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_ORDER' })}
            onChange={handleOrderChange}
            error={formik.errors.order_id as string}
            touched={formik.touched.order_id}
            searchTerm={searchOrderTerm}
            onSearchTermChange={setSearchOrderTerm}
            disabled={!!orderIdFromUrl}
            loading={ordersLoading}
          />
          <SharedDecimalInput
            name="weight"
            label={formatMessage({ id: 'SYSTEM.WEIGHT' }) + ' (kg)'}
            formik={formik}
          />
          <SharedDecimalInput
            name="width"
            label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
            formik={formik}
          />
          <SharedDecimalInput
            name="length"
            label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
            formik={formik}
          />
          <SharedDecimalInput
            name="height"
            label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
            formik={formik}
          />
          <SharedInput
            name="volume"
            label={formatMessage({ id: 'SYSTEM.VOLUME' }) + ' (см³)'}
            type="number"
            formik={formik}
            disabled
          />
          <SharedInput
            name="places_count"
            label={formatMessage({ id: 'SYSTEM.PLACE_COUNT' })}
            type="number"
            formik={formik}
            disabled
          />
          <SharedInput
            name="price"
            label={`${formatMessage({ id: 'SYSTEM.PRICE' })} (${currentCurrency.code})`}
            formik={formik}
            type="number"
            disabled
          />

          {isEditMode && (
            <>
              <SharedSelect
                name="status"
                label={formatMessage({ id: 'SYSTEM.STATUS' })}
                formik={formik}
                options={packageStatusOptions.map((status) => ({
                  label: status.name,
                  value: status.value
                }))}
              />
            </>
          )}
          <Divider />
          <h3 className="card-title">{formatMessage({ id: 'SYSTEM.BOX_TYPE' })}</h3>
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.BOX_TYPE' })}
            value={formik.values.box_type_id ?? ''}
            options={
              boxTypesData?.result?.map((app) => ({
                id: app.id,
                name: String(app.name || app.id)
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_BOX_TYPE' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_BOX_TYPE' })}
            onChange={handleBoxTypeChange}
            error={formik.errors.box_type_id as string}
            touched={formik.touched.box_type_id}
            searchTerm={searchBoxTypeTerm}
            onSearchTermChange={setSearchBoxTypeTerm}
            loading={boxTypesLoading}
          />
          <SharedDecimalInput
            name="box_width"
            label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
            formik={formik}
            disabled={!!formik.values.box_type_id}
          />
          <SharedDecimalInput
            name="box_length"
            label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
            formik={formik}
            disabled={!!formik.values.box_type_id}
          />
          <SharedDecimalInput
            name="box_height"
            label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
            formik={formik}
            disabled={!!formik.values.box_type_id}
          />
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-danger"
              onClick={handleCancel}
              type="button"
              disabled={cancelLoading || !formik.values.order_id}
            >
              {cancelLoading
                ? formatMessage({ id: 'SYSTEM.CANCELLING' })
                : formatMessage({ id: 'SYSTEM.CANCEL' })}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading || formik.isSubmitting}
            >
              {submitLoading
                ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                : formatMessage({ id: 'SYSTEM.CREATE' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

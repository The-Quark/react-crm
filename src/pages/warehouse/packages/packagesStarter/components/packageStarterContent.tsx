import { getOrders, putPackage, postPackage, postOrderCalculate, putOrderStatus } from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SharedAutocomplete,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';
import { OrderStatus, PackageStatus } from '@/api/enums';
import { packageStatusOptions } from '@/utils/enumsOptions/mocks.ts';
import { CACHE_TIME, decimalValidation, LOCAL_STORAGE_CURRENCY_KEY } from '@/utils';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';
import { IPostCalculateFormFields } from '@/api/post/postWorkflow/postOrderCalculate/types.ts';

interface Props {
  isEditMode: boolean;
  packageData?: Package;
  packageId?: number;
}

export const formSchema = Yup.object().shape({
  order_id: Yup.string().required('Order is required'),
  weight: decimalValidation.required('Weight is required'),
  width: decimalValidation.required('Width is required'),
  length: decimalValidation.required('Length is required'),
  height: decimalValidation.required('Height is required'),
  status: Yup.string().optional()
});

export const PackageStarterContent = ({ isEditMode, packageId, packageData }: Props) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const currentCurrency = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);
  const [loading, setLoading] = useState(false);

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
      getOrders({ per_page: 50, searchorder: searchOrderTerm, status: 'package_awaiting' }),
    staleTime: CACHE_TIME
  });

  const selectedOrder = useMemo(() => {
    if (orderIdFromUrl) {
      return ordersData?.result?.find((order) => order.id === orderIdFromUrl);
    }
    return null;
  }, [orderIdFromUrl, ordersData?.result]);

  const initialValues = useMemo<IPackageFormValues & { status?: PackageStatus }>(() => {
    if (isEditMode && packageData) {
      return {
        order_id: packageData.order_id?.toString() ?? '',
        weight: packageData?.weight?.toString() ?? '',
        width: packageData?.width?.toString() ?? '',
        length: packageData?.length?.toString() ?? '',
        height: packageData?.height?.toString() ?? '',
        volume: packageData?.volume?.toString() ?? '',
        places_count: packageData?.places_count?.toString() ?? '',
        price: packageData?.price?.toString() ?? '',
        status: packageData.status as unknown as PackageStatus
      };
    }

    return {
      order_id: orderIdFromUrl?.toString() ?? '',
      weight: selectedOrder?.weight?.toString() ?? '',
      width: selectedOrder?.width?.toString() ?? '',
      length: selectedOrder?.length?.toString() ?? '',
      height: selectedOrder?.height?.toString() ?? '',
      volume: selectedOrder?.volume?.toString() ?? '',
      places_count: selectedOrder?.places_count?.toString() ?? '',
      price: selectedOrder?.price?.toString() ?? ''
    };
  }, [isEditMode, packageData, orderIdFromUrl, selectedOrder]);

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
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
        queryClient.invalidateQueries({ queryKey: ['package'] });
        navigate('/warehouse/packages/list');
        resetForm();
        setSearchOrderTerm('');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

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
          price: selectedOrder.price?.toString() ?? ''
        });
      }
    },
    [formik, ordersData?.result]
  );

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
      setLoading(true);
      await putOrderStatus({
        id: Number(formik.values.order_id),
        status: OrderStatus.CANCELLED
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/call-center/orders/list');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [formik.values.order_id, navigate, queryClient]);

  if (ordersLoading) {
    return <SharedLoading />;
  }

  if (ordersIsError) {
    return <SharedError error={ordersError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">{isEditMode ? 'Edit Package' : 'New Package'}</h3>
        </div>

        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Order"
            value={formik.values.order_id ?? ''}
            options={
              ordersData?.result?.map((app) => ({
                id: app.id,
                name: String(app.order_code || app.id)
              })) ?? []
            }
            placeholder="Select order"
            searchPlaceholder="Search order"
            onChange={handleOrderChange}
            error={formik.errors.order_id as string}
            touched={formik.touched.order_id}
            searchTerm={searchOrderTerm}
            onSearchTermChange={setSearchOrderTerm}
            disabled={!!orderIdFromUrl}
          />

          <SharedDecimalInput name="weight" label="Weight (kg)" formik={formik} />
          <SharedDecimalInput name="width" label="Width (cm)" formik={formik} />
          <SharedDecimalInput name="length" label="Length (cm)" formik={formik} />
          <SharedDecimalInput name="height" label="Height (cm)" formik={formik} />
          <SharedInput name="volume" label="Volume (см³)" type="number" formik={formik} disabled />
          <SharedInput
            name="places_count"
            label="Places Count"
            type="number"
            formik={formik}
            disabled
          />
          <SharedInput
            name="price"
            label={`Price (${currentCurrency})`}
            formik={formik}
            type="text"
            disabled
          />

          {isEditMode && (
            <>
              <SharedSelect
                name="status"
                label="Status"
                formik={formik}
                options={packageStatusOptions.map((status) => ({
                  label: status.name,
                  value: status.value
                }))}
              />
            </>
          )}

          <div className="flex justify-end gap-4">
            <button
              className="btn btn-danger"
              onClick={handleCancel}
              type="button"
              disabled={loading || !formik.values.order_id}
            >
              {loading ? 'Cancelling...' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

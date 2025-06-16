import { getOrders, putPackage, postPackage, getCargo } from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
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
import { PackageStatus } from '@/api/enums';
import { packageStatusOptions } from '@/lib/mocks.ts';
import { decimalValidation } from '@/utils';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';

interface Props {
  isEditMode: boolean;
  packageData?: Package;
  packageId?: number;
}

export const formSchema = Yup.object().shape({
  order_id: Yup.string().required('Order is required'),
  weight: decimalValidation.required('Weight is required'),
  dimensions: Yup.string().optional(),
  status: Yup.string().optional(),
  cargo_id: Yup.string().optional()
});

export const PackageStarterContent = ({ isEditMode, packageId, packageData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [orderId] = useState<number | null>(
    searchParams.get('order_id') ? Number(searchParams.get('order_id')) : null
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const [searchCargoTerm, setSearchCargoTerm] = useState('');

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersIsError,
    error: ordersError
  } = useQuery({
    queryKey: ['packageOrders', searchOrderTerm],
    queryFn: () => getOrders({ per_page: 50, searchorder: searchOrderTerm }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: cargoData,
    isLoading: cargoLoading,
    isError: cargoIsError,
    error: cargoError
  } = useQuery({
    queryKey: ['packageCargo', packageId],
    queryFn: () => getCargo({ id: packageId ? parseInt(String(packageId)) : undefined }),
    staleTime: 60 * 60 * 1000,
    enabled: isEditMode
  });

  const initialValues: IPackageFormValues & { status?: PackageStatus; cargo_id?: string } = {
    order_id: orderId ? String(orderId) : '',
    weight: orderId
      ? ordersData?.result?.find((order) => order.id === orderId)?.weight?.toString() || ''
      : '',
    dimensions: '',
    ...(isEditMode && { status: 'ready_send' as unknown as PackageStatus, cargo_id: '' })
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && packageId) {
          const { status, cargo_id, ...putData } = values;
          await putPackage(Number(packageId), {
            ...putData,
            status: status as PackageStatus,
            cargo_id: cargo_id !== undefined ? String(cargo_id) : '',
            order_id: Number(putData.order_id)
          });
          queryClient.invalidateQueries({ queryKey: ['package'] });
          navigate('/warehouse/packages/list');
          resetForm();
          setSearchOrderTerm('');
          setSearchCargoTerm('');
        } else {
          await postPackage(values);
          queryClient.invalidateQueries({ queryKey: ['package'] });
          navigate('/warehouse/packages/list');
          resetForm();
          setSearchOrderTerm('');
          setSearchCargoTerm('');
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  const handleOrderChange = (orderId: string) => {
    formik.setFieldValue('order_id', orderId);
    console.log('order_ID: ', orderId);
    const selectedOrder = ordersData?.result?.find((order) => order.id === Number(orderId));
    if (selectedOrder?.weight) {
      formik.setFieldValue('weight', selectedOrder.weight.toString());
    }
  };

  useEffect(() => {
    formik.resetForm();
    if (packageData && isEditMode) {
      formik.setValues(
        {
          order_id: packageData.order_id ?? orderId,
          weight: parseFloat(packageData.weight) ?? 0,
          dimensions: packageData.dimensions ?? '',
          status: packageData.status as unknown as PackageStatus,
          cargo_id: packageData.cargo_id?.toString() ?? ''
        },
        false
      );
    }
  }, [isEditMode, packageData]);

  if (ordersLoading || (isEditMode && cargoLoading)) {
    return <SharedLoading />;
  }

  if (ordersIsError) {
    return <SharedError error={ordersError} />;
  }

  if (isEditMode && cargoIsError) {
    return <SharedError error={cargoError} />;
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
            onChange={(val: string | number) =>
              handleOrderChange(orderId ? String(orderId) : String(val))
            }
            error={formik.errors.order_id as string}
            touched={formik.touched.order_id}
            searchTerm={searchOrderTerm}
            onSearchTermChange={setSearchOrderTerm}
          />

          <SharedDecimalInput name="weight" label="Weight (kg)" formik={formik} />

          {isEditMode && (
            <>
              <SharedInput name="dimensions" label="Dimensions" formik={formik} />
              <SharedAutocomplete
                label="Cargo"
                value={formik.values.cargo_id ?? ''}
                options={
                  cargoData?.result?.map((app) => ({
                    id: app.id,
                    name: app.code
                  })) ?? []
                }
                placeholder="Select cargo"
                searchPlaceholder="Search cargo"
                onChange={(val) => {
                  formik.setFieldValue('cargo_id', val);
                }}
                error={formik.errors.cargo_id as string}
                touched={formik.touched.cargo_id}
                searchTerm={searchCargoTerm}
                onSearchTermChange={setSearchCargoTerm}
              />
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

import { getClients, getOrders, getPackages, putPackage, postPackage } from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { IPackageFormValues } from '@/api/post/postPackage/types.ts';
import { PackageStatus } from '@/api/get/getPackages/types.ts';
import { packageStatusOptions } from '@/lib/mocks.ts';

export const formSchema = Yup.object().shape({
  client_id: Yup.string().required('Client is required'),
  order_id: Yup.string().required('Order is required'),
  weight: Yup.number()
    .min(0, 'Weight cannot be negative')
    .test('is-two-decimal', 'The weight field must have exactly 2 decimal places.', (value) => {
      if (value === undefined || value === null) return true;
      const decimalPart = value.toString().split('.')[1];
      return decimalPart?.length === 2;
    })
    .optional(),
  dimensions: Yup.string().optional(),
  status: Yup.string().optional()
});

export const PackageStarterContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOrderTerm, setSearchOrderTerm] = useState('');

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersIsError,
    error: ordersError
  } = useQuery({
    queryKey: ['packageOrders'],
    queryFn: () => getOrders(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsIsError,
    error: clientsError
  } = useQuery({
    queryKey: ['packageClients'],
    queryFn: () => getClients(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: packageData,
    isLoading: packageLoading,
    isError: packageIsError,
    error: packageError
  } = useQuery({
    queryKey: ['package', id],
    queryFn: () => getPackages(id ? parseInt(id) : undefined),
    enabled: isEditMode
  });

  const initialValues: IPackageFormValues & { status?: PackageStatus } = {
    client_id: '',
    order_id: '',
    weight: '',
    dimensions: '',
    ...(isEditMode && { status: 'ready_send' as unknown as PackageStatus })
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && id) {
          const { status, ...putData } = values;
          await putPackage(Number(id), { ...putData, status: status as PackageStatus });
          queryClient.invalidateQueries({ queryKey: ['package'] });
          navigate('/call-center/packages/list');
          resetForm();
          setSearchTerm('');
          setSearchOrderTerm('');
        } else {
          await postPackage(values);
          queryClient.invalidateQueries({ queryKey: ['package'] });
          navigate('/call-center/packages/list');
          resetForm();
          setSearchTerm('');
          setSearchOrderTerm('');
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  useEffect(() => {
    formik.resetForm();
    if (packageData && isEditMode) {
      formik.setValues(
        {
          client_id: packageData.result[0].client_id ?? '',
          order_id: packageData.result[0].order_id ?? '',
          weight: parseFloat(packageData.result[0].weight) ?? 0,
          dimensions: packageData.result[0].dimensions ?? '',
          status: packageData.result[0].status as unknown as PackageStatus
        },
        false
      );
    }
  }, [isEditMode, packageData]);

  if (ordersLoading || clientsLoading || (isEditMode && packageLoading)) {
    return <SharedLoading />;
  }

  if (ordersIsError) {
    return <SharedError error={ordersError} />;
  }

  if (clientsIsError) {
    return <SharedError error={clientsError} />;
  }

  if (isEditMode && packageIsError) {
    return <SharedError error={packageError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">{isEditMode ? 'Edit Package' : 'New Package'}</h3>
        </div>

        <div className="card-body grid gap-5">
          <SharedAutocomplete
            label="Client"
            value={formik.values.client_id ?? ''}
            options={
              clientsData?.result?.map((app) => ({
                id: app.id,
                name: app.first_name || app.company_name
              })) ?? []
            }
            placeholder="Select client"
            searchPlaceholder="Search client"
            onChange={(val) => {
              formik.setFieldValue('client_id', val);
            }}
            error={formik.errors.client_id as string}
            touched={formik.touched.client_id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
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
            onChange={(val) => {
              formik.setFieldValue('order_id', val);
            }}
            error={formik.errors.order_id as string}
            touched={formik.touched.order_id}
            searchTerm={searchOrderTerm}
            onSearchTermChange={setSearchOrderTerm}
          />

          <SharedInput name="weight" label="Weight" formik={formik} type="number" />

          {isEditMode && (
            <>
              <SharedInput name="dimensions" label="Dimensions" formik={formik} />
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

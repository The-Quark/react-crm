import {
  getAirlines,
  getGlobalParameters,
  getCargo,
  postCargo,
  putCargo,
  getPackages
} from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo } from 'react';
import {
  SharedAutocomplete,
  SharedDateTimePicker,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedMultiSelect,
  SharedSelect
} from '@/partials/sharedUI';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ICargoPostFormValues } from '@/api/post/postCargo/types.ts';
import { CargoStatus } from '@/api/get/getCargo/types.ts';
import { cargoStatusOptions } from '@/lib/mocks.ts';
import { Textarea } from '@/components/ui/textarea.tsx';
import { format } from 'date-fns';

export const formSchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .matches(/^[0-9]{3}-[0-9]{8}$/, 'Code must be in format XXX-XXXXXXXX'),
  airline: Yup.string().required('Airline is required'),
  company_id: Yup.string().required('Company is required'),
  packages: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one package must be selected')
    .required('Packages is required'),
  departure_date: Yup.string().required('Departure date is required'),
  arrival_date: Yup.string().required('Arrival date is required'),
  from_airport: Yup.string().required('From airport date is required'),
  to_airport: Yup.string().required('To airport is required'),
  is_international: Yup.boolean().required('Is international is required'),
  notes: Yup.string().required('Notes is required')
});

export const CargoStarterContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchAirlineTerm, setSearchAirlineTerm] = useState('');
  const [searchCompanyOrderTerm, setSearchCompanyOrderTerm] = useState('');

  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['cargoAirlines'],
    queryFn: () => getAirlines(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: companiesData,
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesError
  } = useQuery({
    queryKey: ['cargoCompanies'],
    queryFn: () => getGlobalParameters(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isError: packagesIsError,
    error: packagesError
  } = useQuery({
    queryKey: ['cargoPackages'],
    queryFn: () => getPackages(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: cargoData,
    isLoading: cargoLoading,
    isError: cargoIsError,
    error: cargoError
  } = useQuery({
    queryKey: ['cargo', id],
    queryFn: () => getCargo(id ? parseInt(id) : undefined),
    enabled: isEditMode
  });

  const packageOptions = useMemo(() => {
    const allPackages = [
      ...(packagesData?.result || []),
      ...(isEditMode && cargoData ? cargoData.result[0].packages : [])
    ];

    const uniquePackages = allPackages.reduce(
      (acc: typeof allPackages, current: (typeof allPackages)[number]) => {
        if (!acc.find((item) => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      },
      [] as typeof allPackages
    );

    return uniquePackages.map((pack) => ({
      value: pack.id.toString(),
      label: pack.hawb
    }));
  }, [packagesData, cargoData, isEditMode]);

  const initialValues: ICargoPostFormValues & { status?: string } = {
    airline: '',
    arrival_date: '',
    code: '',
    notes: '',
    from_airport: '',
    to_airport: '',
    departure_date: '',
    packages: [],
    is_international: false,
    company_id: '',
    status: 'formed'
  };
  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const payload = {
          ...values,
          arrival_date: values.arrival_date
            ? format(new Date(values.arrival_date), 'dd.MM.yyyy HH:mm:ss')
            : '',
          departure_date: values.departure_date
            ? format(new Date(values.departure_date), 'dd.MM.yyyy HH:mm:ss')
            : ''
        };
        if (isEditMode && id) {
          const { status, ...putData } = payload;
          await putCargo(Number(id), { ...putData, status: status as CargoStatus });
          queryClient.invalidateQueries({ queryKey: ['cargo'] });
          navigate('/call-center/cargo/list');
          resetForm();
          setSearchAirlineTerm('');
          setSearchCompanyOrderTerm('');
        } else {
          await postCargo(payload);
          queryClient.invalidateQueries({ queryKey: ['cargo'] });
          navigate('/call-center/cargo/list');
          resetForm();
          setSearchAirlineTerm('');
          setSearchCompanyOrderTerm('');
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
    if (cargoData && isEditMode) {
      const packageIds = cargoData.result[0].packages.map((pkg) => pkg.id.toString());

      formik.setValues(
        {
          arrival_date: cargoData.result[0].arrival_date,
          company_id: cargoData.result[0].company_id.toString(),
          departure_date: cargoData.result[0].departure_date,
          from_airport: cargoData.result[0].from_airport,
          is_international: cargoData.result[0].is_international,
          notes: cargoData.result[0].notes,
          packages: packageIds, // Use the transformed package IDs
          to_airport: cargoData.result[0].to_airport,
          code: cargoData.result[0].code,
          airline: cargoData.result[0].airline.toString(),
          status: cargoData.result[0].status as unknown as CargoStatus
        },
        false
      );
    }
  }, [isEditMode, cargoData]);

  if (airlinesLoading || companiesLoading || packagesLoading || (isEditMode && cargoLoading)) {
    return <SharedLoading />;
  }

  if (airlinesIsError) {
    return <SharedError error={airlinesError} />;
  }

  if (companiesIsError) {
    return <SharedError error={companiesError} />;
  }

  if (packagesIsError) {
    return <SharedError error={packagesError} />;
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
          <SharedInput name="code" label="Code" formik={formik} />

          <SharedAutocomplete
            label="Company"
            value={formik.values.company_id ?? ''}
            options={
              companiesData?.result?.map((app) => ({
                id: app.id,
                name: app.company_name
              })) ?? []
            }
            placeholder="Select company"
            searchPlaceholder="Search company"
            onChange={(val) => {
              formik.setFieldValue('company_id', val);
            }}
            error={formik.errors.company_id as string}
            touched={formik.touched.company_id}
            searchTerm={searchCompanyOrderTerm}
            onSearchTermChange={setSearchCompanyOrderTerm}
          />
          <SharedAutocomplete
            label="Airline"
            value={formik.values.airline ?? ''}
            options={
              airlinesData?.result?.map((app) => ({
                id: app.id,
                name: app.name
              })) ?? []
            }
            placeholder="Select airline"
            searchPlaceholder="Search airline"
            onChange={(val) => {
              formik.setFieldValue('airline', val);
            }}
            error={formik.errors.airline as string}
            touched={formik.touched.airline}
            searchTerm={searchAirlineTerm}
            onSearchTermChange={setSearchAirlineTerm}
          />

          <SharedDateTimePicker name="departure_date" label="Departure date" formik={formik} />

          <SharedInput name="from_airport" label="From Airport" formik={formik} />

          <SharedDateTimePicker name="arrival_date" label="Arrival date" formik={formik} />

          <SharedInput name="to_airport" label="To Airport" formik={formik} />

          <SharedMultiSelect
            options={packageOptions}
            selectedValues={formik.values.packages.map(String)}
            onChange={(values) => formik.setFieldValue('packages', values)}
            placeholder="Select packages..."
            searchPlaceholder="Search packages..."
            label="Packages"
            error={formik.errors.packages as string}
            touched={formik.touched.packages}
          />

          <SharedSelect
            name="status"
            label="Status"
            formik={formik}
            options={cargoStatusOptions.map((status) => ({
              label: status.name,
              value: status.value
            }))}
          />

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Notes</label>
            <div className="flex columns-1 w-full flex-wrap">
              <Textarea rows={4} placeholder="Notes" {...formik.getFieldProps('notes')} />
              {formik.touched.notes && formik.errors.notes && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.notes}
                </span>
              )}
            </div>
          </div>

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

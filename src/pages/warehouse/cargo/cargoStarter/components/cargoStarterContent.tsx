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
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useParams } from 'react-router';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ICargoPostFormValues } from '@/api/post/postWorkflow/postCargo/types.ts';
import { CargoStatus } from '@/api/enums';
import { cargoStatusOptions } from '@/utils/enumsOptions/mocks.ts';
import { format } from 'date-fns';
import { useIntl } from 'react-intl';

export const formSchema = Yup.object().shape({
  code: Yup.string()
    .optional()
    .matches(/^[0-9]{3}-[0-9]{8}$/, 'VALIDATION.CODE_FORMAT'),
  airline: Yup.string().required('VALIDATION.AIRLINE_REQUIRED'),
  company_id: Yup.string().required('VALIDATION.COMPANY_REQUIRED'),
  packages: Yup.array()
    .of(Yup.string().required())
    .min(1, 'VALIDATION.PACKAGES_MIN')
    .required('VALIDATION.PACKAGES_REQUIRED'),
  departure_date: Yup.string().required('VALIDATION.DEPARTURE_DATE_REQUIRED'),
  arrival_date: Yup.string().required('VALIDATION.ARRIVAL_DATE_REQUIRED'),
  from_airport: Yup.string().required('VALIDATION.FROM_AIRPORT_REQUIRED'),
  to_airport: Yup.string().required('VALIDATION.TO_AIRPORT_REQUIRED'),
  notes: Yup.string().optional()
});

export const CargoStarterContent = () => {
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageIdsParam = searchParams.get('package_id');
  const [searchAirlineTerm, setSearchAirlineTerm] = useState('');
  const [searchCompanyOrderTerm, setSearchCompanyOrderTerm] = useState('');

  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['cargoAirlines'],
    queryFn: () => getAirlines({ is_active: true }),
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
    queryFn: () => getPackages({ status: 'ready_for_shipment' }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: cargoData,
    isLoading: cargoLoading,
    isError: cargoIsError,
    error: cargoError
  } = useQuery({
    queryKey: ['cargo', id],
    queryFn: () => getCargo({ id: id ? parseInt(id) : undefined }),
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

  const initialPackageIds = useMemo(() => {
    if (!packageIdsParam) return [];
    if (packageIdsParam.includes(',')) {
      return packageIdsParam.split(',').map((id) => id.trim());
    }
    return [packageIdsParam];
  }, [packageIdsParam]);

  const initialValues: ICargoPostFormValues & { status?: string } = {
    airline: '',
    arrival_date: '',
    code: '',
    notes: '',
    from_airport: '',
    to_airport: '',
    departure_date: '',
    packages: initialPackageIds.map((id) => Number(id)).filter((id) => !isNaN(id)) || [],
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
          navigate('/warehouse/cargo/list');
          resetForm();
          setSearchAirlineTerm('');
          setSearchCompanyOrderTerm('');
        } else {
          await postCargo(payload);
          queryClient.invalidateQueries({ queryKey: ['cargo'] });
          navigate('/warehouse/cargo/list');
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

    if (!isEditMode && initialPackageIds.length > 0) {
      formik.setFieldValue('packages', initialPackageIds);
    }
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
          packages: packageIds,
          to_airport: cargoData.result[0].to_airport,
          code: cargoData.result[0].code,
          airline: cargoData.result[0].airline.toString(),
          status: cargoData.result[0].status as unknown as CargoStatus
        },
        false
      );
    }
  }, [isEditMode, cargoData, initialPackageIds]);

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
          <h3 className="card-title">
            {isEditMode
              ? formatMessage({ id: 'SYSTEM.EDIT_CARGO' })
              : formatMessage({ id: 'SYSTEM.NEW_CARGO' })}
          </h3>
        </div>

        <div className="card-body grid gap-5">
          <SharedMultiSelect
            options={packageOptions}
            selectedValues={formik.values.packages.map(String)}
            onChange={(values) => formik.setFieldValue('packages', values)}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_PACKAGES' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_PACKAGES' })}
            label={formatMessage({ id: 'SYSTEM.PACKAGES' })}
            error={formik.errors.packages as string}
            touched={formik.touched.packages}
          />
          <SharedInput name="code" label={formatMessage({ id: 'SYSTEM.CODE' })} formik={formik} />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.COMPANY' })}
            value={formik.values.company_id ?? ''}
            options={
              companiesData?.result?.map((app) => ({
                id: app.id,
                name: app.company_name
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_COMPANY' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COMPANY' })}
            onChange={(val) => {
              formik.setFieldValue('company_id', val);
            }}
            error={formik.errors.company_id as string}
            touched={formik.touched.company_id}
            searchTerm={searchCompanyOrderTerm}
            onSearchTermChange={setSearchCompanyOrderTerm}
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.AIRLINE' })}
            value={formik.values.airline ?? ''}
            options={
              airlinesData?.result?.map((app) => ({
                id: app.id,
                name: app.name
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_AIRLINE' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_AIRLINE' })}
            onChange={(val) => {
              formik.setFieldValue('airline', val);
            }}
            error={formik.errors.airline as string}
            touched={formik.touched.airline}
            searchTerm={searchAirlineTerm}
            onSearchTermChange={setSearchAirlineTerm}
          />

          <SharedDateTimePicker
            name="departure_date"
            label={formatMessage({ id: 'SYSTEM.DEPARTURE_DATE' })}
            formik={formik}
          />

          <SharedInput
            name="from_airport"
            label={formatMessage({ id: 'SYSTEM.FROM_AIRPORT' })}
            formik={formik}
          />

          <SharedDateTimePicker
            name="arrival_date"
            label={formatMessage({ id: 'SYSTEM.ARRIVAL_DATE' })}
            formik={formik}
          />

          <SharedInput
            name="to_airport"
            label={formatMessage({ id: 'SYSTEM.TO_AIRPORT' })}
            formik={formik}
          />

          {isEditMode && (
            <SharedSelect
              name="status"
              label={formatMessage({ id: 'SYSTEM.STATUS' })}
              formik={formik}
              disabled={true}
              options={cargoStatusOptions.map((status) => ({
                label: status.name,
                value: status.value
              }))}
            />
          )}

          <SharedTextArea
            name="notes"
            label={formatMessage({ id: 'SYSTEM.NOTES' })}
            formik={formik}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || formik.isSubmitting}
            >
              {loading
                ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                : formatMessage({ id: 'SYSTEM.SAVE' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

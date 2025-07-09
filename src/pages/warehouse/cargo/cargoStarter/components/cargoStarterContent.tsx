import React, { useState, useMemo } from 'react';
import { getAirlines, getGlobalParameters, postCargo, putCargo, getPackages } from '@/api';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ICargoPostFormValues } from '@/api/post/postWorkflow/postCargo/types.ts';
import { CargoStatus, PackageStatus } from '@/api/enums';
import { cargoStatusOptions } from '@/utils/enumsOptions/mocks.ts';
import { format } from 'date-fns';
import { useIntl } from 'react-intl';
import { Cargo } from '@/api/get/getWorkflow/getCargo/types.ts';
import { CACHE_TIME } from '@/utils';

interface Props {
  isEditMode: boolean;
  cargoData?: Cargo;
  cargoId?: number;
}

export const formSchema = Yup.object().shape({
  code: Yup.string()
    .optional()
    .matches(/^[0-9]{3}-[0-9]{8}$/, 'VALIDATION.CODE_FORMAT'),
  airline: Yup.string().required('VALIDATION.AIRLINE_REQUIRED'),
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

const getInitialValues = (
  isEditMode: boolean,
  cargoData: Cargo,
  packageIds: string[]
): ICargoPostFormValues => {
  if (isEditMode && cargoData) {
    return {
      arrival_date: cargoData.arrival_date,
      departure_date: cargoData.departure_date,
      from_airport: cargoData.from_airport,
      is_international: cargoData.is_international,
      notes: cargoData.notes,
      packages: cargoData.packages.map((pkg) => pkg.id.toString()),
      to_airport: cargoData.to_airport,
      code: cargoData.code,
      airline: cargoData.airline.toString(),
      status: cargoData.status as unknown as CargoStatus
    };
  }
  return {
    airline: '',
    arrival_date: '',
    code: '',
    notes: '',
    from_airport: '',
    to_airport: '',
    departure_date: '',
    packages: packageIds,
    is_international: false,
    status: 'formed'
  };
};

export const CargoStarterContent = ({ cargoId, cargoData, isEditMode }: Props) => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [searchAirlineTerm, setSearchAirlineTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const packageIdsParam = searchParams.get('package_id');

  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['cargoAirlines'],
    queryFn: () => getAirlines({ is_active: true }),
    staleTime: CACHE_TIME
  });

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isError: packagesIsError,
    error: packagesError
  } = useQuery({
    queryKey: ['cargoPackages', searchTerm],
    queryFn: () => getPackages({ status: PackageStatus.PACKAGE_RECEIVED, hawb: searchTerm }),
    staleTime: CACHE_TIME
  });

  const packageOptions = useMemo(() => {
    const allPackages = [
      ...(packagesData?.result || []),
      ...(isEditMode && cargoData ? cargoData.packages : [])
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
  }, [packageIdsParam, cargoId]);

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, cargoData || ({} as Cargo), initialPackageIds),
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
        if (isEditMode && cargoId) {
          const { status, ...putData } = payload;
          await putCargo(Number(cargoId), { ...putData, status: status as CargoStatus });
        } else {
          await postCargo(payload);
        }
        queryClient.invalidateQueries({ queryKey: ['cargo'] });
        navigate('/warehouse/cargo/list');
        resetForm();
        setSearchAirlineTerm('');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  const isLoading = airlinesLoading || packagesLoading;

  const renderError = () => {
    if (airlinesIsError) return <SharedError error={airlinesError} />;
    if (packagesIsError) return <SharedError error={packagesError} />;
    return null;
  };

  if (isLoading) {
    return <SharedLoading simple />;
  }

  const errorComponent = renderError();
  if (errorComponent) {
    return errorComponent;
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
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            loading={packagesLoading}
          />
          <SharedInput
            name="code"
            label={formatMessage({ id: 'SYSTEM.MAWB_CODE' })}
            formik={formik}
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

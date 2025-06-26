import {
  getCitiesByCountryCode,
  getCountries,
  getGlobalParameters,
  getGlobalParamsDepartments,
  getGlobalParamsPositions,
  getGlobalParamsSubdivisions,
  getVehicles,
  postCreateUser,
  putUser,
  putUserRole
} from '@/api';
import { IUserFormValues } from '@/api/post/postUser/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { Gender, UserDriverStatus, UserStatus } from '@/api/enums';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/utils/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import {
  mockDriverStatusOptions,
  mockGenderOptions,
  mockLicenseCategoryOptions,
  mockUserStatusOptions
} from '@/utils/enumsOptions/mocks.ts';
import { format } from 'date-fns';
import { IGetUserByParams } from '@/api/get/getUser/getUserByParams/types.ts';
import { CrudAvatarUpload } from '@/partials/crud';
import { useAuthContext } from '@/auth';
import { useIntl } from 'react-intl';

interface Props {
  isEditMode: boolean;
  usersData?: IGetUserByParams;
  userId?: number;
}

export const formSchemaPost = Yup.object().shape({
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'VALIDATION.FORM_VALIDATION_PHONE_INVALID')
    .required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
  first_name: Yup.string().required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
  last_name: Yup.string().required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
  patronymic: Yup.string().optional(),
  birth_date: Yup.string().required('VALIDATION.BIRTH_DATE_REQUIRED'),
  subdivision_id: Yup.string().required('VALIDATION.SUBDIVISION_REQUIRED'),
  department_id: Yup.string().required('VALIDATION.DEPARTMENT_REQUIRED'),
  position_id: Yup.string().required('VALIDATION.POSITION_REQUIRED'),
  email: Yup.string()
    .email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID')
    .required('VALIDATION.EMAIL_REQUIRED'),
  country_id: Yup.string().required('VALIDATION.COUNTRY_REQUIRED'),
  city_id: Yup.string().required('VALIDATION.CITY_REQUIRED'),
  license_category: Yup.string().optional(),
  vehicle_id: Yup.string().optional(),
  driver_status: Yup.string().optional(),
  password: Yup.string()
    .min(10, 'VALIDATION.PASSWORD_MIN')
    .max(100, 'VALIDATION.PASSWORD_MAX')
    .matches(/[A-Z]/, 'VALIDATION.PASSWORD_UPPERCASE')
    .matches(/\d/, 'VALIDATION.PASSWORD_NUMBER')
    .matches(/[^a-zA-Z0-9]/, 'VALIDATION.PASSWORD_SPECIAL_CHAR')
    .required('VALIDATION.PASSWORD_REQUIRED')
});

export const formSchemaPut = Yup.object().shape({
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'VALIDATION.FORM_VALIDATION_PHONE_INVALID')
    .required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
  first_name: Yup.string().required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
  last_name: Yup.string().required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
  patronymic: Yup.string().optional(),
  birth_date: Yup.string().required('VALIDATION.BIRTH_DATE_REQUIRED'),
  subdivision_id: Yup.string().required('VALIDATION.SUBDIVISION_REQUIRED'),
  department_id: Yup.string().required('VALIDATION.DEPARTMENT_REQUIRED'),
  position_id: Yup.string().required('VALIDATION.POSITION_REQUIRED'),
  email: Yup.string()
    .email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID')
    .required('VALIDATION.EMAIL_REQUIRED'),
  country_id: Yup.string().required('VALIDATION.COUNTRY_REQUIRED'),
  city_id: Yup.string().required('VALIDATION.CITY_REQUIRED'),
  license_category: Yup.string().optional(),
  vehicle_id: Yup.string().optional(),
  driver_status: Yup.string().optional(),
  driver_details: Yup.string().optional()
});

const getInitialValues = (
  isEditMode: boolean,
  userData: IGetUserByParams,
  initialCompanyId: number | string
): IUserFormValues => {
  if (isEditMode && userData?.result) {
    const data = userData.result[0];
    return {
      avatar: data.avatar || null,
      email: data.email || '',
      status: data.status || UserStatus.ACTIVE,
      birth_date: data.birth_date || '',
      company_id: data.company_id || initialCompanyId,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      patronymic: data.patronymic || '',
      phone: data.phone || '',
      position_id: data.position_id || '',
      department_id: data.department_id || '',
      subdivision_id: data.subdivision_id || '',
      gender: data.gender || Gender.MALE,
      location: String(data.location?.id) || '',
      password: '',
      city_id: String(data.location?.id) || '',
      country_id: String(data.location?.country_id) || '',
      role: 'driver',
      license_category: data.license_category || 'B',
      vehicle_id: data.vehicle_id || '',
      driver_status: data.driver_status || UserDriverStatus.AVAILABLE,
      driver_details: data.driver_details || ''
    };
  }
  return {
    avatar: null,
    email: '',
    status: UserStatus.ACTIVE,
    birth_date: '',
    company_id: initialCompanyId,
    first_name: '',
    last_name: '',
    patronymic: '',
    phone: '',
    position_id: '',
    department_id: '',
    subdivision_id: '',
    location: '',
    gender: Gender.MALE,
    password: '',
    city_id: '',
    country_id: '',
    role: 'driver',
    license_category: 'B',
    vehicle_id: '',
    driver_status: UserDriverStatus.AVAILABLE,
    driver_details: ''
  };
};

export const DriversStarterContent: FC<Props> = ({ isEditMode, usersData, userId }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : '';
  const isAdmin = currentUser?.roles[0].name === 'superadmin';
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const [searchDepartmentTerm, setSearchDepartmentTerm] = useState('');
  const [searchSubdivisionTerm, setSearchSubdivisionTerm] = useState('');
  const [searchPositionTerm, setSearchPositionTerm] = useState('');
  const [searchCountryTerm, setSearchCountryTerm] = useState('');
  const [searchCityTerm, setSearchCityTerm] = useState('');
  const [searchVehicleTerm, setSearchVehicleTerm] = useState('');
  const [removeAvatar, setRemoveAvatar] = useState<boolean>(false);

  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
    isError: vehiclesIsError,
    error: vehiclesError
  } = useQuery({
    queryKey: ['staff-vehicles'],
    queryFn: () => getVehicles({}),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: companiesData,
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesError
  } = useQuery({
    queryKey: ['hrModuleCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: 60 * 60 * 1000,
    enabled: isAdmin
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, usersData as IGetUserByParams, initialCompanyId),
    validationSchema: isEditMode ? formSchemaPut : formSchemaPost,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const payloadPost = {
          ...values,
          location: values.city_id,
          company_id: Number(currentUser?.company_id) || 0,
          birth_date: values.birth_date
            ? format(new Date(values.birth_date), 'dd.MM.yyyy HH:mm:ss')
            : '',
          avatar: typeof values.avatar === 'string' ? null : values.avatar?.file || null
        };
        const payloadPut = {
          ...values,
          location: values.city_id,
          company_id: Number(currentUser?.company_id) || 0,
          birth_date: values.birth_date
            ? format(new Date(values.birth_date), 'dd.MM.yyyy HH:mm:ss')
            : '',
          avatar: typeof values.avatar === 'string' ? null : values.avatar?.file || null,
          id: Number(userId)
        };
        const payloadRoleUpdate = {
          user: Number(userId) || 0,
          role: values.role || '',
          mode: 'give' as 'give' | 'revoke'
        };
        delete (payloadPost as Partial<typeof payloadPost>).city_id;
        delete (payloadPost as Partial<typeof payloadPost>).country_id;
        delete (payloadPut as Partial<typeof payloadPut>).city_id;
        delete (payloadPut as Partial<typeof payloadPut>).country_id;
        delete (payloadPut as Partial<typeof payloadPut>).password;
        if (isEditMode) {
          await putUser(payloadPut, removeAvatar);
          await putUserRole(payloadRoleUpdate);
          queryClient.invalidateQueries({ queryKey: ['drivers'] });
          navigate('/hr-module/drivers/list');
          resetForm();
        } else {
          await postCreateUser(payloadPost);
          queryClient.invalidateQueries({ queryKey: ['drivers'] });
          navigate('/hr-module/drivers/list');
          resetForm();
        }
        setSearchCompanyTerm('');
        setSearchDepartmentTerm('');
        setSearchSubdivisionTerm('');
        setSearchPositionTerm('');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isError: departmentsIsError,
    error: departmentsError
  } = useQuery({
    queryKey: ['drivers-departments', formik.values.company_id],
    queryFn: () =>
      getGlobalParamsDepartments({
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined,
        is_active: true
      }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: subdivisionsData,
    isLoading: subdivisionsLoading,
    isError: subdivisionsIsError,
    error: subdivisionsError
  } = useQuery({
    queryKey: ['drivers-subdivisions', formik.values.company_id],
    queryFn: () =>
      getGlobalParamsSubdivisions({
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined,
        is_active: true
      }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: positionsData,
    isLoading: positionsLoading,
    isError: positionsIsError,
    error: positionsError
  } = useQuery({
    queryKey: ['drivers-positions', formik.values.company_id],
    queryFn: () =>
      getGlobalParamsPositions({
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined,
        is_active: true
      }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: [
      'staff-cities',
      formik.values.country_id || usersData?.result[0]?.location?.country_id
    ],
    queryFn: () =>
      getCitiesByCountryCode(
        (formik.values.country_id || String(usersData?.result[0]?.location?.country_id)).toString(),
        'id'
      ),
    enabled: !!formik.values.country_id || !!usersData?.result[0]?.location?.country_id
  });

  if (companiesLoading || vehiclesLoading) {
    return <SharedLoading />;
  }

  if (countriesIsError) {
    return <SharedError error={countriesError} />;
  }

  if (citiesIsError) {
    return <SharedError error={citiesError} />;
  }

  if (departmentsIsError) {
    return <SharedError error={departmentsError} />;
  }

  if (vehiclesIsError) {
    return <SharedError error={vehiclesError} />;
  }

  if (positionsIsError) {
    return <SharedError error={positionsError} />;
  }

  if (subdivisionsIsError) {
    return <SharedError error={subdivisionsError} />;
  }

  if (companiesIsError && isAdmin) {
    return <SharedError error={companiesError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode
              ? formatMessage({ id: 'SYSTEM.EDIT_DRIVER' })
              : formatMessage({ id: 'SYSTEM.NEW_DRIVER' })}
          </h3>
        </div>

        <div className="card-body grid gap-5">
          <div className="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">{formatMessage({ id: 'SYSTEM.PHOTO' })}</label>
            <div className="flex items-center justify-between flex-wrap grow gap-2.5">
              <span className="text-2sm font-medium text-gray-600">
                {formatMessage({ id: 'SYSTEM.PHOTO_DIMENSIONS' })}
              </span>
              <CrudAvatarUpload
                avatarUser={formik.values.avatar}
                onChange={(newAvatar) => formik.setFieldValue('avatar', newAvatar)}
                onChangeRemoveAvatar={() => {
                  formik.setFieldValue('avatar', null);
                  setRemoveAvatar(true);
                }}
              />
            </div>
          </div>
          <SharedInput
            name="first_name"
            label={formatMessage({ id: 'SYSTEM.FIRST_NAME' })}
            formik={formik}
          />
          <SharedInput
            name="last_name"
            label={formatMessage({ id: 'SYSTEM.LAST_NAME' })}
            formik={formik}
          />
          <SharedInput
            name="patronymic"
            label={formatMessage({ id: 'SYSTEM.PATRONYMIC' })}
            formik={formik}
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
            value={formik.values.country_id}
            options={countriesData?.data ?? []}
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_COUNTRY' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
            onChange={(val) => {
              formik.setFieldValue('country_id', val);
              formik.setFieldValue('city_id', '');
            }}
            error={formik.errors.country_id as string}
            touched={formik.touched.country_id}
            searchTerm={searchCountryTerm}
            onSearchTermChange={setSearchCountryTerm}
            loading={countriesLoading}
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.CITY' })}
            value={formik.values.city_id}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={
              formik.values.country_id
                ? formatMessage({ id: 'SYSTEM.SELECT_CITY' })
                : formatMessage({ id: 'SYSTEM.SELECT_COUNTRY_FIRST' })
            }
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CITY' })}
            onChange={(val) => formik.setFieldValue('city_id', val)}
            error={formik.errors.city_id as string}
            touched={formik.touched.city_id}
            searchTerm={searchCityTerm}
            onSearchTermChange={setSearchCityTerm}
            disabled={!formik.values.country_id}
            loading={citiesLoading}
            errorText={
              citiesIsError ? formatMessage({ id: 'SYSTEM.FAILED_LOAD_CITIES' }) : undefined
            }
            emptyText={formatMessage({ id: 'SYSTEM.NO_CITIES_AVAILABLE' })}
          />
          <SharedSelect
            name="gender"
            label={formatMessage({ id: 'SYSTEM.GENDER' })}
            formik={formik}
            options={mockGenderOptions.map((opt) => ({
              label: formatMessage({ id: `SYSTEM.GENDER_${opt.value.toUpperCase()}` }),
              value: opt.value
            }))}
          />
          {isEditMode && (
            <SharedSelect
              name="status"
              label={formatMessage({ id: 'SYSTEM.STATUS' })}
              formik={formik}
              options={mockUserStatusOptions.map((opt) => ({
                label: opt.name,
                value: opt.value
              }))}
            />
          )}
          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex- items-center gap-1 max-w-56">
                {formatMessage({ id: 'SYSTEM.BIRTH_DATE' })}
              </label>
              <div className="w-full flex columns-1 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <button id="date" className={cn('input data-[state=open]:border-primary')}>
                      <KeenIcon icon="calendar" className="-ms-0.5" />
                      <span>
                        {formik.values.birth_date
                          ? new Date(formik.values.birth_date).toLocaleDateString()
                          : formatMessage({ id: 'SYSTEM.PICK_DATE' })}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarDate
                      initialFocus
                      mode="single"
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      defaultMonth={new Date(2000, 0)}
                      selected={formik.getFieldProps('birth_date').value}
                      onSelect={(value) => formik.setFieldValue('birth_date', value)}
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.birth_date && formik.errors.birth_date && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formatMessage({ id: formik.errors.birth_date })}{' '}
                  </span>
                )}
              </div>
            </div>
          </div>
          <SharedInput
            name="phone"
            label={formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
            formik={formik}
            type="tel"
          />
          <SharedInput
            name="email"
            label={formatMessage({ id: 'SYSTEM.EMAIL' })}
            formik={formik}
            type="email"
          />
          {isAdmin && (
            <SharedAutocomplete
              label={formatMessage({ id: 'SYSTEM.COMPANY' })}
              value={formik.values.company_id ?? ''}
              options={
                companiesData?.result?.map((company) => ({
                  id: company.id,
                  name: company.company_name
                })) ?? []
              }
              placeholder={formatMessage({ id: 'SYSTEM.SELECT_COMPANY' })}
              searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COMPANY' })}
              onChange={(val) => {
                formik.setFieldValue('company_id', val);
                formik.setFieldValue('department_id', '');
                formik.setFieldValue('subdivision_id', '');
                formik.setFieldValue('position_id', '');
                setSearchDepartmentTerm('');
                setSearchSubdivisionTerm('');
                setSearchPositionTerm('');
              }}
              error={formik.errors.company_id as string}
              touched={formik.touched.company_id}
              searchTerm={searchCompanyTerm}
              onSearchTermChange={setSearchCompanyTerm}
            />
          )}
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.DEPARTMENT' })}
            value={formik.values.department_id ?? ''}
            options={
              departmentsData?.result?.map((app) => ({
                id: app.id,
                name: app.name
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_DEPARTMENT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_DEPARTMENT' })}
            onChange={(val) => {
              formik.setFieldValue('department_id', val);
            }}
            disabled={!formik.values.company_id}
            error={formik.errors.department_id as string}
            touched={formik.touched.department_id}
            searchTerm={searchDepartmentTerm}
            onSearchTermChange={setSearchDepartmentTerm}
            loading={departmentsLoading}
          />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.SUBDIVISION' })}
            value={formik.values.subdivision_id ?? ''}
            options={
              subdivisionsData?.result?.map((app) => ({
                id: app.id,
                name: app.name
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_SUBDIVISION' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_SUBDIVISION' })}
            onChange={(val) => {
              formik.setFieldValue('subdivision_id', val);
            }}
            disabled={!formik.values.company_id}
            error={formik.errors.subdivision_id as string}
            touched={formik.touched.subdivision_id}
            searchTerm={searchSubdivisionTerm}
            onSearchTermChange={setSearchSubdivisionTerm}
            loading={subdivisionsLoading}
          />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.POSITION' })}
            value={formik.values.position_id}
            options={
              positionsData?.result?.map((app) => ({
                id: app.id,
                name: app.title
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_POSITION' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_POSITION' })}
            onChange={(val) => {
              formik.setFieldValue('position_id', val);
            }}
            disabled={!formik.values.company_id}
            error={formik.errors.position_id as string}
            touched={formik.touched.position_id}
            searchTerm={searchPositionTerm}
            onSearchTermChange={setSearchPositionTerm}
            loading={positionsLoading}
          />
          <SharedSelect
            name="driver_status"
            label={formatMessage({ id: 'SYSTEM.DRIVER_STATUS' })}
            formik={formik}
            options={mockDriverStatusOptions.map((opt) => ({
              label: opt.name,
              value: opt.value
            }))}
          />
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.VEHICLE' })}
            value={formik.values.vehicle_id ?? ''}
            options={
              vehiclesData?.result?.map((app) => ({
                id: app.id,
                name: app.plate_number
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_VEHICLE' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_VEHICLE' })}
            onChange={(val) => {
              formik.setFieldValue('vehicle_id', val);
            }}
            error={formik.errors.vehicle_id as string}
            touched={formik.touched.vehicle_id}
            searchTerm={searchVehicleTerm}
            onSearchTermChange={setSearchVehicleTerm}
          />
          <SharedSelect
            name="license_category"
            label={formatMessage({ id: 'SYSTEM.LICENSE_CATEGORY' })}
            formik={formik}
            options={mockLicenseCategoryOptions.map((opt) => ({
              label: opt.name,
              value: opt.value
            }))}
          />
          <SharedTextArea
            name="driver_details"
            label={formatMessage({ id: 'SYSTEM.DRIVER_DETAILS' })}
            formik={formik}
          />
          {!isEditMode && (
            <SharedInput
              name="password"
              label={formatMessage({ id: 'SYSTEM.PASSWORD' })}
              formik={formik}
              type="password"
            />
          )}
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

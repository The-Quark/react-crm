import {
  getCitiesByCountryCode,
  getCountries,
  getGlobalParameters,
  getGlobalParamsDepartments,
  getGlobalParamsPositions,
  getGlobalParamsSubdivisions,
  getRoles,
  postCreateUser,
  putUser,
  putUserRole
} from '@/api';
import { IUserFormValues } from '@/api/post/postUser/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { PHONE_REG_EXP } from '@/utils/validations/validations.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { UserStatus } from '@/api/enums';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { Gender } from '@/api/enums';
import { mockGenderOptions, mockUserStatusOptions } from '@/lib/mocks.ts';
import { format } from 'date-fns';
import { IGetUserByParams } from '@/api/get/getUser/getUserByParams/types.ts';
import { CrudAvatarUpload } from '@/partials/crud';
import { useAuthContext } from '@/auth';

interface Props {
  isEditMode: boolean;
  usersData?: IGetUserByParams;
  userId?: number;
}

export const formSchemaPost = Yup.object().shape({
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Phone number is not valid')
    .required('Phone number is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  patronymic: Yup.string().required('Patronymic is required'),
  birth_date: Yup.string().required('Birth date is required'),
  company_id: Yup.string().required('Company is required'),
  subdivision_id: Yup.string().required('Subdivision is required'),
  department_id: Yup.string().required('Department is required'),
  position_id: Yup.string().required('Position is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  country_id: Yup.string().required('Country is required'),
  city_id: Yup.string().required('City is required'),
  password: Yup.string()
    .min(10, 'Minimum 10 symbols')
    .max(100, 'Maximum 100 symbols')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character')
    .required('Password is required')
});

export const formSchemaPut = Yup.object().shape({
  phone: Yup.string()
    .matches(PHONE_REG_EXP, 'Phone number is not valid')
    .required('Phone number is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  patronymic: Yup.string().required('Patronymic is required'),
  birth_date: Yup.string().required('Birth date is required'),
  company_id: Yup.string().required('Company is required'),
  subdivision_id: Yup.string().required('Subdivision is required'),
  department_id: Yup.string().required('Department is required'),
  position_id: Yup.string().required('Position is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  country_id: Yup.string().required('Country is required'),
  city_id: Yup.string().required('City is required')
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
      role: String(data.roles[0].name) || 'viewer'
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
    role: 'viewer'
  };
};

export const UsersStarterContent: FC<Props> = ({ isEditMode, usersData, userId }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : '';
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
  const [searchDepartmentTerm, setSearchDepartmentTerm] = useState('');
  const [searchSubdivisionTerm, setSearchSubdivisionTerm] = useState('');
  const [searchPositionTerm, setSearchPositionTerm] = useState('');
  const [searchCountryTerm, setSearchCountryTerm] = useState('');
  const [searchCityTerm, setSearchCityTerm] = useState('');
  const [removeAvatar, setRemoveAvatar] = useState<boolean>(false);

  const {
    data: companiesData,
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesError
  } = useQuery({
    queryKey: ['users-companies'],
    queryFn: () => getGlobalParameters(),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesIsError,
    error: rolesError
  } = useQuery({
    queryKey: ['users-roles'],
    queryFn: () => getRoles(currentUser ? Number(currentUser.id) : 0, true),
    staleTime: 60 * 60 * 1000
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
          birth_date: values.birth_date
            ? format(new Date(values.birth_date), 'dd.MM.yyyy HH:mm:ss')
            : '',
          avatar: typeof values.avatar === 'string' ? null : values.avatar?.file || null
        };
        const payloadPut = {
          ...values,
          location: values.city_id,
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
          queryClient.invalidateQueries({ queryKey: ['users'] });
          navigate('/crm/users/list');
          resetForm();
        } else {
          await postCreateUser(payloadPost);
          queryClient.invalidateQueries({ queryKey: ['users'] });
          navigate('/crm/users/list');
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
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined
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
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined
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
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined
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
      'users-cities',
      formik.values.country_id || usersData?.result[0]?.location?.country_id
    ],
    queryFn: () =>
      getCitiesByCountryCode(
        (formik.values.country_id || String(usersData?.result[0]?.location?.country_id)).toString(),
        'id'
      ),
    enabled: !!formik.values.country_id || !!usersData?.result[0]?.location?.country_id
  });

  if (companiesLoading || rolesLoading) {
    return <SharedLoading />;
  }

  if (countriesIsError) {
    return <SharedError error={countriesError} />;
  }

  if (rolesIsError) {
    return <SharedError error={rolesError} />;
  }
  if (citiesIsError) {
    return <SharedError error={citiesError} />;
  }

  if (companiesIsError) {
    return <SharedError error={companiesError} />;
  }

  if (departmentsIsError) {
    return <SharedError error={departmentsError} />;
  }

  if (positionsIsError) {
    return <SharedError error={positionsError} />;
  }

  if (subdivisionsIsError) {
    return <SharedError error={subdivisionsError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">{isEditMode ? 'Edit User' : 'New User'}</h3>
        </div>

        <div className="card-body grid gap-5">
          <div className="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Photo</label>
            <div className="flex items-center justify-between flex-wrap grow gap-2.5">
              <span className="text-2sm font-medium text-gray-600">150x150px JPEG, PNG Image</span>
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
          <SharedInput name="first_name" label="First name" formik={formik} />
          <SharedInput name="last_name" label="Last name" formik={formik} />
          <SharedInput name="patronymic" label="Patronymic" formik={formik} />
          <SharedAutocomplete
            label="Country"
            value={formik.values.country_id}
            options={countriesData?.data ?? []}
            placeholder="Select country"
            searchPlaceholder="Search country"
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
            label="City"
            value={formik.values.city_id}
            options={citiesData?.data[0]?.cities ?? []}
            placeholder={formik.values.country_id ? 'Select city' : 'Select country first'}
            searchPlaceholder="Search city"
            onChange={(val) => formik.setFieldValue('city_id', val)}
            error={formik.errors.city_id as string}
            touched={formik.touched.city_id}
            searchTerm={searchCityTerm}
            onSearchTermChange={setSearchCityTerm}
            disabled={!formik.values.country_id}
            loading={citiesLoading}
            errorText={citiesIsError ? 'Failed to load cities' : undefined}
            emptyText="No cities available"
          />
          <SharedSelect
            name="role"
            label="Role"
            formik={formik}
            options={
              rolesData?.result
                ? rolesData.result.map((opt) => ({
                    label: opt.name,
                    value: opt.name
                  }))
                : []
            }
          />
          <SharedSelect
            name="gender"
            label="Gender"
            formik={formik}
            options={mockGenderOptions.map((opt) => ({
              label: opt.name,
              value: opt.value
            }))}
          />
          {isEditMode && (
            <SharedSelect
              name="status"
              label="Status"
              formik={formik}
              options={mockUserStatusOptions.map((opt) => ({
                label: opt.name,
                value: opt.value
              }))}
            />
          )}
          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex- items-center gap-1 max-w-56">Birth Date</label>
              <div className="w-full flex columns-1 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <button id="date" className={cn('input data-[state=open]:border-primary')}>
                      <KeenIcon icon="calendar" className="-ms-0.5" />
                      <span>
                        {formik.values.birth_date
                          ? new Date(formik.values.birth_date).toLocaleDateString()
                          : 'Pick a date'}
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
                    {formik.errors.birth_date}
                  </span>
                )}
              </div>
            </div>
          </div>
          <SharedInput name="phone" label="Phone number" formik={formik} type="tel" />
          <SharedInput name="email" label="Email" formik={formik} type="email" />
          <SharedAutocomplete
            label="Company"
            value={formik.values.company_id ?? ''}
            options={
              companiesData?.result?.map((company) => ({
                id: company.id,
                name: company.company_name
              })) ?? []
            }
            placeholder="Select company"
            searchPlaceholder="Search company"
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
          <SharedAutocomplete
            label="Department"
            value={formik.values.department_id ?? ''}
            options={
              departmentsData?.result?.map((app) => ({
                id: app.id,
                name: app.name
              })) ?? []
            }
            placeholder="Select department"
            searchPlaceholder="Search department"
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
            label="Subdivision"
            value={formik.values.subdivision_id ?? ''}
            options={
              subdivisionsData?.result?.map((app) => ({
                id: app.id,
                name: app.name
              })) ?? []
            }
            placeholder="Select subdivision"
            searchPlaceholder="Search subdivision"
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
            label="Position"
            value={formik.values.position_id ?? ''}
            options={
              positionsData?.result?.map((app) => ({
                id: app.id,
                name: app.title
              })) ?? []
            }
            placeholder="Select position"
            searchPlaceholder="Search position"
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
          {!isEditMode && (
            <SharedInput name="password" label="Password" formik={formik} type="password" />
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

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
import { PHONE_REG_EXP } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import {
  SharedAutocomplete,
  SharedDateDayPicker,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { UserStatus } from '@/api/enums';
import { Gender } from '@/api/enums';
import { mockGenderOptions, mockUserStatusOptions } from '@/utils/enumsOptions/mocks.ts';
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

const formSchemas = {
  post: Yup.object().shape({
    phone: Yup.string().required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
    first_name: Yup.string().required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    last_name: Yup.string().required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    patronymic: Yup.string().optional(),
    birth_date: Yup.string().required('VALIDATION.BIRTH_DATE_REQUIRED'),
    company_id: Yup.string().required('VALIDATION.COMPANY_REQUIRED'),
    subdivision_id: Yup.string().required('VALIDATION.SUBDIVISION_REQUIRED'),
    department_id: Yup.string().required('VALIDATION.DEPARTMENT_REQUIRED'),
    position_id: Yup.string().required('VALIDATION.POSITION_REQUIRED'),
    email: Yup.string()
      .email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID')
      .required('VALIDATION.EMAIL_REQUIRED'),
    country_id: Yup.string().required('VALIDATION.COUNTRY_REQUIRED'),
    city_id: Yup.string().required('VALIDATION.CITY_REQUIRED'),
    password: Yup.string()
      .min(10, 'VALIDATION.PASSWORD_MIN')
      .max(100, 'VALIDATION.PASSWORD_MAX')
      .matches(/[A-Z]/, 'VALIDATION.PASSWORD_UPPERCASE')
      .matches(/\d/, 'VALIDATION.PASSWORD_NUMBER')
      .matches(/[^a-zA-Z0-9]/, 'VALIDATION.PASSWORD_SPECIAL_CHAR')
      .required('VALIDATION.PASSWORD_REQUIRED')
  }),
  put: Yup.object().shape({
    phone: Yup.string().required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED'),
    first_name: Yup.string().required('VALIDATION.FORM_VALIDATION_FIRST_NAME_REQUIRED'),
    last_name: Yup.string().required('VALIDATION.FORM_VALIDATION_LAST_NAME_REQUIRED'),
    patronymic: Yup.string().optional(),
    birth_date: Yup.string().required('VALIDATION.BIRTH_DATE_REQUIRED'),
    company_id: Yup.string().required('VALIDATION.COMPANY_REQUIRED'),
    subdivision_id: Yup.string().required('VALIDATION.SUBDIVISION_REQUIRED'),
    department_id: Yup.string().required('VALIDATION.DEPARTMENT_REQUIRED'),
    position_id: Yup.string().required('VALIDATION.POSITION_REQUIRED'),
    email: Yup.string()
      .email('VALIDATION.FORM_VALIDATION_EMAIL_INVALID')
      .required('VALIDATION.EMAIL_REQUIRED'),
    country_id: Yup.string().required('VALIDATION.COUNTRY_REQUIRED'),
    city_id: Yup.string().required('VALIDATION.CITY_REQUIRED')
  })
};

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [removeAvatar, setRemoveAvatar] = useState<boolean>(false);
  const [searchTerms, setSearchTerms] = useState({
    company: '',
    department: '',
    subdivision: '',
    position: '',
    country: '',
    city: ''
  });

  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : '';
  const isAdmin = currentUser?.roles[0].name === 'superadmin';

  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesIsError,
    error: rolesError
  } = useQuery({
    queryKey: ['users-roles'],
    queryFn: () => getRoles(currentUser ? Number(currentUser.id) : 0, true)
  });

  const {
    data: companiesData,
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesError
  } = useQuery({
    queryKey: ['users-companies'],
    queryFn: () => getGlobalParameters()
  });

  const formik = useFormik({
    initialValues: getInitialValues(isEditMode, usersData as IGetUserByParams, initialCompanyId),
    validationSchema: isEditMode ? formSchemas.put : formSchemas.post,
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
        } else {
          await postCreateUser(payloadPost);
        }
        queryClient.invalidateQueries({ queryKey: ['users'] });
        navigate('/crm/users/list');
        resetForm();
        setSearchTerms({
          company: '',
          department: '',
          subdivision: '',
          position: '',
          country: '',
          city: ''
        });
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
    queryKey: ['users-departments', formik.values.company_id],
    queryFn: () =>
      getGlobalParamsDepartments({
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined,
        is_active: true
      })
  });

  const {
    data: subdivisionsData,
    isLoading: subdivisionsLoading,
    isError: subdivisionsIsError,
    error: subdivisionsError
  } = useQuery({
    queryKey: ['users-subdivisions', formik.values.company_id],
    queryFn: () =>
      getGlobalParamsSubdivisions({
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined,
        is_active: true
      })
  });

  const {
    data: positionsData,
    isLoading: positionsLoading,
    isError: positionsIsError,
    error: positionsError
  } = useQuery({
    queryKey: ['users-positions', formik.values.company_id],
    queryFn: () =>
      getGlobalParamsPositions({
        company_id: formik.values.company_id ? Number(formik.values.company_id) : undefined,
        is_active: true
      })
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

  const isLoading = companiesLoading || rolesLoading || countriesLoading;

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode
              ? formatMessage({ id: 'SYSTEM.EDIT_USER' })
              : formatMessage({ id: 'SYSTEM.NEW_USER' })}
          </h3>
        </div>

        {isLoading ? (
          <SharedLoading simple />
        ) : (
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
              searchTerm={searchTerms.country}
              onSearchTermChange={(term) => setSearchTerms({ ...searchTerms, country: term })}
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
              searchTerm={searchTerms.city}
              onSearchTermChange={(term) => setSearchTerms({ ...searchTerms, city: term })}
              disabled={!formik.values.country_id}
              loading={citiesLoading}
              errorText={
                citiesIsError ? formatMessage({ id: 'SYSTEM.FAILED_LOAD_CITIES' }) : undefined
              }
              emptyText={formatMessage({ id: 'SYSTEM.NO_CITIES_AVAILABLE' })}
            />
            <SharedSelect
              name="role"
              label={formatMessage({ id: 'SYSTEM.ROLE' })}
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
            <SharedDateDayPicker
              name="birth_date"
              label={formatMessage({ id: 'SYSTEM.BIRTH_DATE' })}
              formik={formik}
            />
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
                  setSearchTerms({ ...searchTerms, department: '', subdivision: '', position: '' });
                }}
                error={formik.errors.company_id as string}
                touched={formik.touched.company_id}
                searchTerm={searchTerms.company}
                onSearchTermChange={(term) => setSearchTerms({ ...searchTerms, company: term })}
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
              searchTerm={searchTerms.department}
              onSearchTermChange={(term) => setSearchTerms({ ...searchTerms, department: term })}
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
              searchTerm={searchTerms.subdivision}
              onSearchTermChange={(term) => setSearchTerms({ ...searchTerms, subdivision: term })}
              loading={subdivisionsLoading}
            />

            <SharedAutocomplete
              label={formatMessage({ id: 'SYSTEM.POSITION' })}
              value={formik.values.position_id ?? ''}
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
              searchTerm={searchTerms.position}
              onSearchTermChange={(term) => setSearchTerms({ ...searchTerms, position: term })}
              loading={positionsLoading}
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
        )}
      </form>
    </div>
  );
};

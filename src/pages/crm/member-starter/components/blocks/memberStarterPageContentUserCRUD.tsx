import { CrudAvatarUpload } from '@/partials/crud';
import { type MouseEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { postCreateUser } from './memberStarterCreateUserApi.ts';
import { AxiosError } from 'axios';
import { KeenIcon } from '@/components';
import clsx from 'clsx';
import { IImageInputFile } from '@/components/image-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { Role } from '@/api/getRoles/types.ts';
import { getRoles, useCurrentUser } from '@/api';

interface IGeneralSettingsProps {
  title: string;
}

const createUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(10, 'Minimum 10 symbols')
    .max(100, 'Maximum 100 symbols')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character')
    .required('Password is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Phone number is not valid'),
  position: Yup.string().min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols'),
  role: Yup.string().required('Role is required')
});

interface IUserFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  position: string;
  avatar: IImageInputFile | null;
  role: string;
}

const initialValues: IUserFormValues = {
  email: '',
  password: '',
  name: '',
  phone: '',
  location: '',
  position: '',
  avatar: null,
  role: ''
};

export const MemberStarterPageContentUserCRUD = ({ title }: IGeneralSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roleData = await getRoles(currentUser ? Number(currentUser.id) : 0, true);
        setRoles(roleData.result);
      } catch (err) {
        console.error('Error fetching roleData:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createUserSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      try {
        const payload = {
          ...values,
          avatar: values.avatar?.file || null
        };
        await postCreateUser(payload);
        resetForm();
        setStatus('User created successfully!');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus(error.response?.data?.message || 'Failed to create user');
      }

      setLoading(false);
      setSubmitting(false);
    }
  });

  return (
    <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
      <div className="card-header" id="general_settings">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Photo</label>
          <div className="flex items-center justify-between flex-wrap grow gap-2.5">
            <span className="text-2sm font-medium text-gray-600">150x150px JPEG, PNG Image</span>
            <CrudAvatarUpload
              avatarUser={formik.values.avatar}
              onChange={(newAvatar) => formik.setFieldValue('avatar', newAvatar)}
            />
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Name</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Name"
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Email</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="email"
              placeholder="Email"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Phone number</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="tel"
              placeholder="Phone number"
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.phone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Role</label>
          <div className="flex columns-1 w-full flex-wrap">
            <Select
              value={formik.values.role?.toString()}
              onValueChange={(value) => formik.setFieldValue('role', String(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.name} value={role.name.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.role}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Position</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Position"
              {...formik.getFieldProps('position')}
            />
            {formik.touched.position && formik.errors.position && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.position}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Location</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Location"
              {...formik.getFieldProps('location')}
            />
            {formik.touched.location && formik.errors.location && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.location}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
          <label className="form-label max-w-56">Password</label>
          <div className="flex columns-1 w-full flex-wrap">
            <label className="input">
              <input
                className="w-full"
                autoComplete="off"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              <button className="btn btn-icon" onClick={togglePassword}>
                <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
                <KeenIcon
                  icon="eye-slash"
                  className={clsx('text-gray-500', { hidden: !showPassword })}
                />
              </button>
            </label>
            {formik.touched.password && formik.errors.password && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.password}
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
  );
};

export { type IGeneralSettingsProps };

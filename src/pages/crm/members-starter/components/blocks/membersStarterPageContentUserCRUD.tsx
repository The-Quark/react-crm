import { CrudAvatarUpload } from '@/partials/crud';
import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { postCreateUser } from './membersStarterCreateUserApi';
import { AxiosError } from 'axios';

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
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Phone number is not valid'),
  avatar: Yup.mixed().test(
    'fileType',
    'Avatar must be a valid image (jpeg, png, webp, etc.)',
    (value) => {
      if (!value) return true;
      return [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/avif'
      ].includes((value as File).type);
    }
  ),
  position: Yup.string().min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols')
});

const initialValues = {
  email: '',
  password: '',
  name: '',
  phone: '',
  location: '',
  position: ''
};

export const MembersStarterPageContentUserCRUD = ({ title }: IGeneralSettingsProps) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: createUserSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);

      try {
        console.log(values);
        await postCreateUser(values);
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
            <CrudAvatarUpload />
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
              type="text"
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
              type="text"
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
            <input
              className="input w-full"
              type="text"
              placeholder="Password"
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.password}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={loading || formik.isSubmitting}>
            {loading ? 'Please wait...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export { type IGeneralSettingsProps };
